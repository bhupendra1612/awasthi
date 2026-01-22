import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const questionText = formData.get("question") as string;
        const imageFile = formData.get("image") as File | null;

        if (!questionText && !imageFile) {
            return NextResponse.json({ success: false, error: "Please provide a question or image" }, { status: 400 });
        }

        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: "AI service is not configured. Please contact admin."
            }, { status: 500 });
        }

        let answer = "";
        let imageUrl = null;

        // If image is provided, upload to Supabase storage first
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('doubt-images')
                .upload(fileName, imageFile, {
                    contentType: imageFile.type,
                    upsert: false
                });

            if (uploadError) {
                console.error("Image upload error:", uploadError);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('doubt-images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }
        }

        // Prepare Gemini prompt
        const systemPrompt = `You are an expert teacher for Indian government competitive exams (SSC, Railway, Police, RPSC, Bank exams).
Your role is to help students understand concepts and solve their doubts clearly.

LANGUAGE RULES (VERY IMPORTANT):
- Default language: Hinglish (mix of Hindi and English using Roman script)
- If student asks in pure English, respond in English only
- If student asks in Hinglish/Hindi, respond in Hinglish (Hindi words in English script)
- NEVER use Devanagari script (Hindi font)
- Examples of Hinglish: "Yeh question SSC exam mein important hai", "Is formula ko yaad rakho"

FORMATTING:
- Use markdown formatting for better readability
- Use **bold** for important points
- Use numbered lists (1., 2., 3.) for steps
- Use bullet points (-) for lists
- Use proper spacing and line breaks

Guidelines:
- Provide clear, step-by-step explanations
- Use simple language that Indian students understand
- Focus on exam-relevant information
- If it's a math problem, show all calculation steps
- If it's a theory question, provide concise but complete answers
- Be encouraging and supportive
- If the question is unclear, ask for clarification

Student's question: ${questionText || "Please explain what's shown in the image"}`;

        try {
            let geminiResponse;

            if (imageFile) {
                // Convert image to base64 for Gemini Vision
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64Image = buffer.toString('base64');

                geminiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { text: systemPrompt },
                                    {
                                        inline_data: {
                                            mime_type: imageFile.type,
                                            data: base64Image
                                        }
                                    }
                                ]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 2048
                            }
                        })
                    }
                );
            } else {
                // Text-only question
                geminiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: systemPrompt }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 2048
                            }
                        })
                    }
                );
            }

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error("Gemini API error:", geminiResponse.status, errorText);
                throw new Error(`Gemini API error: ${geminiResponse.status}`);
            }

            const geminiData = await geminiResponse.json();
            console.log("Gemini response:", JSON.stringify(geminiData, null, 2));
            answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate an answer. Please try again.";

        } catch (geminiError: any) {
            console.error("Gemini error details:", geminiError);
            answer = `Sorry, I'm having trouble answering right now. Error: ${geminiError.message}`;
        }

        // Save to database
        const { error: dbError } = await supabase
            .from("student_doubts")
            .insert({
                user_id: user.id,
                question_text: questionText,
                question_image_url: imageUrl,
                answer_text: answer
            });

        if (dbError) {
            console.error("Database error:", dbError);
        }

        return NextResponse.json({
            success: true,
            answer: answer,
            imageUrl: imageUrl
        });

    } catch (error: any) {
        console.error("Ask teacher error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Something went wrong"
        }, { status: 500 });
    }
}
