import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// AI API configuration - supports multiple providers
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

        // Try different AI providers in order of preference
        let questions;
        let aiProvider = "demo";

        // 1. Try Google Gemini (FREE & GENEROUS)
        if (GEMINI_API_KEY) {
            try {
                questions = await generateWithGemini(template);
                aiProvider = "Gemini";
            } catch (error: any) {
                console.log("Gemini failed:", error.message);
            }
        }

        // 2. Try Groq (FREE & FAST)
        if (!questions && GROQ_API_KEY) {
            try {
                questions = await generateWithGroq(template);
                aiProvider = "Groq";
            } catch (error: any) {
                console.log("Groq failed:", error.message);
            }
        }

        // 3. Try OpenAI (if others failed)
        if (!questions && OPENAI_API_KEY) {
            try {
                questions = await generateWithOpenAI(template);
                aiProvider = "OpenAI";
            } catch (error: any) {
                console.log("OpenAI failed:", error.message);
            }
        }

        // 4. Try Anthropic Claude (if others failed)
        if (!questions && ANTHROPIC_API_KEY) {
            try {
                questions = await generateWithClaude(template);
                aiProvider = "Claude";
            } catch (error: any) {
                console.log("Claude failed:", error.message);
            }
        }

        // 5. Fallback to demo mode
        if (!questions) {
            questions = generateMockQuestions(template);
            aiProvider = "Demo";
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
                approval_deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
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
            await supabase.from("generated_daily_tests").delete().eq("id", test.id);
            return NextResponse.json({ success: false, error: questionsError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Test generated successfully using ${aiProvider}!`,
            testId: test.id,
            questionsCount: questions.length,
            provider: aiProvider
        });

    } catch (error: any) {
        console.error("Generate test error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Google Gemini API (FREE - 1500 requests/day)
async function generateWithGemini(template: any) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `You are an expert question paper creator for Indian government competitive exams. ${template.ai_prompt}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000,
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Gemini API error");
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text;

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse Gemini response");
}

// Groq API (FREE - 14,400 requests/day)
async function generateWithGroq(template: any) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Groq API error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse Groq response");
}

// OpenAI API (Paid)
async function generateWithOpenAI(template: any) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse OpenAI response");
}

// Anthropic Claude API (Free $5/month)
async function generateWithClaude(template: any) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 4000,
            messages: [{
                role: "user",
                content: `You are an expert question paper creator for Indian government competitive exams. ${template.ai_prompt}`
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Claude API error");
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse Claude response");
}

// Mock questions for demo/testing
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