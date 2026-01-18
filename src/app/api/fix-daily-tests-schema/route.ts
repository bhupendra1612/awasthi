import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();

        // Sample test data - we'll try to insert directly
        const sampleTests = [
            {
                title: 'Daily Practice - SSC General Knowledge',
                exam_category: 'SSC',
                subject: 'General Knowledge',
                difficulty: 'easy',
                questions_count: 5,
                duration_minutes: 10,
                test_date: new Date().toISOString().split('T')[0],
                status: 'published',
                questions: [
                    {
                        id: "1",
                        question: "Who is the current President of India?",
                        options: ["Ram Nath Kovind", "Droupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
                        correct_answer: 1,
                        explanation: "Droupadi Murmu is the current President of India, serving since July 2022."
                    },
                    {
                        id: "2",
                        question: "Which planet is known as the Red Planet?",
                        options: ["Venus", "Mars", "Jupiter", "Saturn"],
                        correct_answer: 1,
                        explanation: "Mars is known as the Red Planet due to iron oxide on its surface."
                    },
                    {
                        id: "3",
                        question: "What is the capital of Rajasthan?",
                        options: ["Jodhpur", "Udaipur", "Jaipur", "Kota"],
                        correct_answer: 2,
                        explanation: "Jaipur is the capital city of Rajasthan, also known as the Pink City."
                    },
                    {
                        id: "4",
                        question: "Who wrote the Indian National Anthem?",
                        options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Mahatma Gandhi"],
                        correct_answer: 0,
                        explanation: "Jana Gana Mana was written by Rabindranath Tagore."
                    },
                    {
                        id: "5",
                        question: "Which is the longest river in India?",
                        options: ["Yamuna", "Brahmaputra", "Ganga", "Godavari"],
                        correct_answer: 2,
                        explanation: "The Ganga is the longest river in India, flowing for about 2,525 km."
                    }
                ]
            },
            {
                title: 'Daily Practice - Railway General Science',
                exam_category: 'Railway',
                subject: 'General Science',
                difficulty: 'medium',
                questions_count: 5,
                duration_minutes: 10,
                test_date: new Date().toISOString().split('T')[0],
                status: 'published',
                questions: [
                    {
                        id: "1",
                        question: "What is the chemical formula of water?",
                        options: ["H2O", "CO2", "NaCl", "HCl"],
                        correct_answer: 0,
                        explanation: "Water has the chemical formula H2O."
                    },
                    {
                        id: "2",
                        question: "Which gas is most abundant in Earth's atmosphere?",
                        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                        correct_answer: 2,
                        explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
                    },
                    {
                        id: "3",
                        question: "What is the speed of light in vacuum?",
                        options: ["3 × 10^8 m/s", "3 × 10^6 m/s", "3 × 10^10 m/s", "3 × 10^4 m/s"],
                        correct_answer: 0,
                        explanation: "The speed of light in vacuum is approximately 3 × 10^8 meters per second."
                    },
                    {
                        id: "4",
                        question: "Which organ produces insulin?",
                        options: ["Liver", "Kidney", "Pancreas", "Heart"],
                        correct_answer: 2,
                        explanation: "The pancreas produces insulin, which regulates blood sugar levels."
                    },
                    {
                        id: "5",
                        question: "What is the atomic number of carbon?",
                        options: ["4", "6", "8", "12"],
                        correct_answer: 1,
                        explanation: "Carbon has an atomic number of 6."
                    }
                ]
            }
        ];

        const createdTests = [];
        const errors = [];

        for (const testData of sampleTests) {
            const { data: test, error: testError } = await supabase
                .from('generated_daily_tests')
                .insert(testData)
                .select()
                .single();

            if (testError) {
                console.error('Error inserting test:', testError);
                errors.push({
                    test: testData.title,
                    error: testError.message
                });
                continue;
            }

            createdTests.push(test);
        }

        if (errors.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Failed to create some tests. The 'questions' column might not exist in the database.`,
                errors,
                createdCount: createdTests.length
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully created ${createdTests.length} sample daily tests`,
            tests: createdTests
        });

    } catch (error) {
        console.error('Error creating daily tests:', error);
        return NextResponse.json(
            { error: 'Failed to create tests', details: error },
            { status: 500 }
        );
    }
}