import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { templateId } = await request.json();

        // Verify user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Fetch template
        const { data: template, error: templateError } = await supabase
            .from("daily_test_templates")
            .select("*")
            .eq("id", templateId)
            .single();

        if (templateError || !template) {
            return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
        }

        // Check if OpenAI API key is configured
        if (!OPENAI_API_KEY) {
            // For demo/testing without API key - create mock questions
            const mockQuestions = generateMockQuestions(template);

            // Create the test
            const { data: test, error: testError } = await supabase
                .from("generated_daily_tests")
                .insert({
                    template_id: template.id,
                    title: `${template.exam_category} - ${template.subject} (${new Date().toLocaleDateString("en-IN")})`,
                    exam_category: template.exam_category,
                    subject: template.subject,
                    difficulty: template.difficulty,
                    questions_count: template.questions_count,
                    duration_minutes: template.duration_minutes,
                    status: "pending_approval",
                    approval_deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
                    test_date: new Date().toISOString().split("T")[0]
                })
                .select()
                .single();

            if (testError) {
                return NextResponse.json({ success: false, error: testError.message }, { status: 500 });
            }

            // Insert mock questions
            const questionsToInsert = mockQuestions.map((q: any, index: number) => ({
                daily_test_id: test.id,
                question_text: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                correct_option: q.correct_option,
                explanation: q.explanation,
                order_index: index
            }));

            await supabase.from("generated_daily_questions").insert(questionsToInsert);

            return NextResponse.json({
                success: true,
                message: "Test generated (demo mode - add OPENAI_API_KEY for real AI generation)",
                testId: test.id
            });
        }

        // Call OpenAI API
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Cost-effective model
                messages: [
                    {
                        role: "system",
                        content: "You are an expert question paper creator for Indian government competitive exams. Generate high-quality MCQ questions with accurate answers and explanations. Always respond with valid JSON."
                    },
                    {
                        role: "user",
                        content: template.ai_prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();

            // If quota exceeded, fall back to demo mode
            if (errorData.error?.code === 'insufficient_quota' || errorData.error?.message?.includes('quota')) {
                console.log("OpenAI quota exceeded, falling back to demo mode");
                const mockQuestions = generateMockQuestions(template);

                // Create the test with mock questions
                const { data: test, error: testError } = await supabase
                    .from("generated_daily_tests")
                    .insert({
                        template_id: template.id,
                        title: `${template.exam_category} - ${template.subject} (${new Date().toLocaleDateString("en-IN")})`,
                        exam_category: template.exam_category,
                        subject: template.subject,
                        difficulty: template.difficulty,
                        questions_count: template.questions_count,
                        duration_minutes: template.duration_minutes,
                        status: "pending_approval",
                        approval_deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                        test_date: new Date().toISOString().split("T")[0]
                    })
                    .select()
                    .single();

                if (testError) {
                    return NextResponse.json({ success: false, error: testError.message }, { status: 500 });
                }

                // Insert mock questions
                const questionsToInsert = mockQuestions.map((q: any, index: number) => ({
                    daily_test_id: test.id,
                    question_text: q.question,
                    option_a: q.option_a,
                    option_b: q.option_b,
                    option_c: q.option_c,
                    option_d: q.option_d,
                    correct_option: q.correct_option,
                    explanation: q.explanation,
                    order_index: index
                }));

                await supabase.from("generated_daily_questions").insert(questionsToInsert);

                return NextResponse.json({
                    success: true,
                    message: "Test generated in demo mode (OpenAI quota exceeded - add credits to use AI)",
                    testId: test.id
                });
            }

            return NextResponse.json({
                success: false,
                error: "OpenAI API error: " + (errorData.error?.message || "Unknown error")
            }, { status: 500 });
        }

        const openaiData = await openaiResponse.json();
        const aiContent = openaiData.choices[0]?.message?.content;

        // Parse JSON from AI response
        let questions;
        try {
            // Try to extract JSON from the response
            const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                questions = JSON.parse(aiContent);
            }
        } catch (parseError) {
            return NextResponse.json({
                success: false,
                error: "Failed to parse AI response. Please try again."
            }, { status: 500 });
        }

        // Create the test
        const { data: test, error: testError } = await supabase
            .from("generated_daily_tests")
            .insert({
                template_id: template.id,
                title: `${template.exam_category} - ${template.subject} (${new Date().toLocaleDateString("en-IN")})`,
                exam_category: template.exam_category,
                subject: template.subject,
                difficulty: template.difficulty,
                questions_count: questions.length,
                duration_minutes: template.duration_minutes,
                status: "pending_approval",
                approval_deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
                test_date: new Date().toISOString().split("T")[0]
            })
            .select()
            .single();

        if (testError) {
            return NextResponse.json({ success: false, error: testError.message }, { status: 500 });
        }

        // Insert questions
        const questionsToInsert = questions.map((q: any, index: number) => ({
            daily_test_id: test.id,
            question_text: q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option.toUpperCase(),
            explanation: q.explanation || "",
            order_index: index
        }));

        const { error: questionsError } = await supabase
            .from("generated_daily_questions")
            .insert(questionsToInsert);

        if (questionsError) {
            // Rollback - delete the test
            await supabase.from("generated_daily_tests").delete().eq("id", test.id);
            return NextResponse.json({ success: false, error: questionsError.message }, { status: 500 });
        }

        // TODO: Send WhatsApp notification to admin
        // await sendWhatsAppNotification(test.id, template.name);

        return NextResponse.json({
            success: true,
            message: "Test generated successfully!",
            testId: test.id,
            questionsCount: questions.length
        });

    } catch (error: any) {
        console.error("Generate test error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Mock questions for demo/testing without OpenAI API key
function generateMockQuestions(template: any) {
    const mockQuestions = [
        {
            question: "भारत की राजधानी क्या है?",
            option_a: "मुंबई",
            option_b: "दिल्ली",
            option_c: "कोलकाता",
            option_d: "चेन्नई",
            correct_option: "B",
            explanation: "नई दिल्ली भारत की राजधानी है।"
        },
        {
            question: "What is the capital of India?",
            option_a: "Mumbai",
            option_b: "New Delhi",
            option_c: "Kolkata",
            option_d: "Chennai",
            correct_option: "B",
            explanation: "New Delhi is the capital of India."
        },
        {
            question: "Which river is known as 'Ganga of South'?",
            option_a: "Krishna",
            option_b: "Godavari",
            option_c: "Kaveri",
            option_d: "Narmada",
            correct_option: "B",
            explanation: "Godavari is known as 'Ganga of South' or 'Dakshin Ganga'."
        },
        {
            question: "Who wrote the Indian National Anthem?",
            option_a: "Bankim Chandra Chatterjee",
            option_b: "Rabindranath Tagore",
            option_c: "Sarojini Naidu",
            option_d: "Muhammad Iqbal",
            correct_option: "B",
            explanation: "Rabindranath Tagore wrote 'Jana Gana Mana', the Indian National Anthem."
        },
        {
            question: "What is 15% of 200?",
            option_a: "25",
            option_b: "30",
            option_c: "35",
            option_d: "40",
            correct_option: "B",
            explanation: "15% of 200 = (15/100) × 200 = 30"
        },
        {
            question: "Which planet is known as the Red Planet?",
            option_a: "Venus",
            option_b: "Mars",
            option_c: "Jupiter",
            option_d: "Saturn",
            correct_option: "B",
            explanation: "Mars is known as the Red Planet due to its reddish appearance."
        },
        {
            question: "The Constitution of India was adopted on?",
            option_a: "26 January 1950",
            option_b: "15 August 1947",
            option_c: "26 November 1949",
            option_d: "2 October 1950",
            correct_option: "C",
            explanation: "The Constitution was adopted on 26 November 1949 and came into effect on 26 January 1950."
        },
        {
            question: "Which is the largest state of India by area?",
            option_a: "Madhya Pradesh",
            option_b: "Maharashtra",
            option_c: "Rajasthan",
            option_d: "Uttar Pradesh",
            correct_option: "C",
            explanation: "Rajasthan is the largest state of India by area (342,239 sq km)."
        },
        {
            question: "Who is known as the Father of the Indian Constitution?",
            option_a: "Mahatma Gandhi",
            option_b: "Jawaharlal Nehru",
            option_c: "B.R. Ambedkar",
            option_d: "Sardar Patel",
            correct_option: "C",
            explanation: "Dr. B.R. Ambedkar is known as the Father of the Indian Constitution."
        },
        {
            question: "Which is the national bird of India?",
            option_a: "Sparrow",
            option_b: "Peacock",
            option_c: "Parrot",
            option_d: "Eagle",
            correct_option: "B",
            explanation: "The Indian Peacock (Pavo cristatus) is the national bird of India."
        }
    ];

    return mockQuestions.slice(0, template.questions_count);
}
