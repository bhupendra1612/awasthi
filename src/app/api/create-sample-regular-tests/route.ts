import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();

        // Create sample regular tests
        const sampleTests = [
            {
                title: 'SSC CGL Mock Test - General Knowledge',
                description: 'Comprehensive mock test for SSC CGL General Knowledge section',
                category: 'SSC',
                subject: 'General Knowledge',
                duration_minutes: 60,
                total_questions: 25,
                total_marks: 50,
                is_free: true,
                price: 0,
                original_price: 199,
                is_featured: true,
                is_published: true,
                negative_marks: true
            },
            {
                title: 'Railway Group D Practice Test',
                description: 'Practice test for Railway Group D examination',
                category: 'Railway',
                subject: 'General Science',
                duration_minutes: 90,
                total_questions: 100,
                total_marks: 100,
                is_free: true,
                price: 0,
                original_price: 299,
                is_featured: false,
                is_published: true,
                negative_marks: true
            }
        ];

        const createdTests = [];

        for (const testData of sampleTests) {
            // Insert test
            const { data: test, error: testError } = await supabase
                .from('tests')
                .insert(testData)
                .select()
                .single();

            if (testError) {
                console.error('Error inserting test:', testError);
                continue;
            }

            createdTests.push(test);

            // Create sample questions for each test
            const sampleQuestions = [
                {
                    test_id: test.id,
                    question_text: "Who is the current President of India?",
                    option_a: "Ram Nath Kovind",
                    option_b: "Droupadi Murmu",
                    option_c: "Pranab Mukherjee",
                    option_d: "A.P.J. Abdul Kalam",
                    correct_answer: "B",
                    explanation: "Droupadi Murmu is the current President of India, serving since July 2022.",
                    marks: 2,
                    negative_marks: 0.5,
                    order_index: 1
                },
                {
                    test_id: test.id,
                    question_text: "Which planet is known as the Red Planet?",
                    option_a: "Venus",
                    option_b: "Mars",
                    option_c: "Jupiter",
                    option_d: "Saturn",
                    correct_answer: "B",
                    explanation: "Mars is known as the Red Planet due to iron oxide on its surface.",
                    marks: 2,
                    negative_marks: 0.5,
                    order_index: 2
                },
                {
                    test_id: test.id,
                    question_text: "What is the capital of Rajasthan?",
                    option_a: "Jodhpur",
                    option_b: "Udaipur",
                    option_c: "Jaipur",
                    option_d: "Kota",
                    correct_answer: "C",
                    explanation: "Jaipur is the capital city of Rajasthan, also known as the Pink City.",
                    marks: 2,
                    negative_marks: 0.5,
                    order_index: 3
                },
                {
                    test_id: test.id,
                    question_text: "Who wrote the Indian National Anthem?",
                    option_a: "Rabindranath Tagore",
                    option_b: "Bankim Chandra Chatterjee",
                    option_c: "Sarojini Naidu",
                    option_d: "Mahatma Gandhi",
                    correct_answer: "A",
                    explanation: "Jana Gana Mana was written by Rabindranath Tagore.",
                    marks: 2,
                    negative_marks: 0.5,
                    order_index: 4
                },
                {
                    test_id: test.id,
                    question_text: "Which is the longest river in India?",
                    option_a: "Yamuna",
                    option_b: "Brahmaputra",
                    option_c: "Ganga",
                    option_d: "Godavari",
                    correct_answer: "C",
                    explanation: "The Ganga is the longest river in India, flowing for about 2,525 km.",
                    marks: 2,
                    negative_marks: 0.5,
                    order_index: 5
                }
            ];

            // Insert questions
            const { error: questionsError } = await supabase
                .from('questions')
                .insert(sampleQuestions);

            if (questionsError) {
                console.error('Error inserting questions:', questionsError);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Created ${createdTests.length} sample tests with questions`,
            tests: createdTests
        });

    } catch (error) {
        console.error('Error creating sample tests:', error);
        return NextResponse.json(
            { error: 'Failed to create sample tests', details: error },
            { status: 500 }
        );
    }
}