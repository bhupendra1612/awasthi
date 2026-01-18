import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = createClient();

        // Sample daily tests data
        const sampleTests = [
            {
                title: 'Daily Practice Test - SSC General Knowledge',
                exam_category: 'SSC',
                subject: 'General Knowledge',
                difficulty: 'medium',
                questions_count: 10,
                duration_minutes: 15,
                test_date: new Date().toISOString().split('T')[0],
                status: 'published',
                questions: [
                    {
                        id: 1,
                        question: "Who is the current President of India?",
                        options: ["Ram Nath Kovind", "Droupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
                        correct_answer: 1,
                        explanation: "Droupadi Murmu is the current President of India, serving since July 2022."
                    },
                    {
                        id: 2,
                        question: "Which planet is known as the Red Planet?",
                        options: ["Venus", "Mars", "Jupiter", "Saturn"],
                        correct_answer: 1,
                        explanation: "Mars is known as the Red Planet due to iron oxide on its surface."
                    },
                    {
                        id: 3,
                        question: "What is the capital of Rajasthan?",
                        options: ["Jodhpur", "Udaipur", "Jaipur", "Kota"],
                        correct_answer: 2,
                        explanation: "Jaipur is the capital city of Rajasthan, also known as the Pink City."
                    },
                    {
                        id: 4,
                        question: "Who wrote the Indian National Anthem?",
                        options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Mahatma Gandhi"],
                        correct_answer: 0,
                        explanation: "Jana Gana Mana was written by Rabindranath Tagore."
                    },
                    {
                        id: 5,
                        question: "Which is the longest river in India?",
                        options: ["Yamuna", "Brahmaputra", "Ganga", "Godavari"],
                        correct_answer: 2,
                        explanation: "The Ganga is the longest river in India, flowing for about 2,525 km."
                    },
                    {
                        id: 6,
                        question: "In which year did India gain independence?",
                        options: ["1945", "1946", "1947", "1948"],
                        correct_answer: 2,
                        explanation: "India gained independence on August 15, 1947."
                    },
                    {
                        id: 7,
                        question: "What is the currency of Japan?",
                        options: ["Yuan", "Won", "Yen", "Ringgit"],
                        correct_answer: 2,
                        explanation: "The Japanese Yen is the official currency of Japan."
                    },
                    {
                        id: 8,
                        question: "Which gas is most abundant in Earth's atmosphere?",
                        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                        correct_answer: 2,
                        explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
                    },
                    {
                        id: 9,
                        question: "Who is known as the Father of the Nation in India?",
                        options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"],
                        correct_answer: 1,
                        explanation: "Mahatma Gandhi is known as the Father of the Nation in India."
                    },
                    {
                        id: 10,
                        question: "Which is the smallest state in India by area?",
                        options: ["Sikkim", "Tripura", "Goa", "Manipur"],
                        correct_answer: 2,
                        explanation: "Goa is the smallest state in India by area."
                    }
                ]
            },
            {
                title: 'Daily Practice Test - Railway Mathematics',
                exam_category: 'Railway',
                subject: 'Mathematics',
                difficulty: 'easy',
                questions_count: 10,
                duration_minutes: 15,
                test_date: new Date().toISOString().split('T')[0],
                status: 'published',
                questions: [
                    {
                        id: 1,
                        question: "What is 15% of 200?",
                        options: ["25", "30", "35", "40"],
                        correct_answer: 1,
                        explanation: "15% of 200 = (15/100) × 200 = 30"
                    },
                    {
                        id: 2,
                        question: "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
                        options: ["120 km", "130 km", "140 km", "150 km"],
                        correct_answer: 3,
                        explanation: "Distance = Speed × Time = 60 × 2.5 = 150 km"
                    },
                    {
                        id: 3,
                        question: "What is the square root of 144?",
                        options: ["11", "12", "13", "14"],
                        correct_answer: 1,
                        explanation: "√144 = 12 because 12 × 12 = 144"
                    },
                    {
                        id: 4,
                        question: "If 3x + 5 = 20, what is the value of x?",
                        options: ["3", "4", "5", "6"],
                        correct_answer: 2,
                        explanation: "3x + 5 = 20, so 3x = 15, therefore x = 5"
                    },
                    {
                        id: 5,
                        question: "What is 7 × 8?",
                        options: ["54", "56", "58", "60"],
                        correct_answer: 1,
                        explanation: "7 × 8 = 56"
                    },
                    {
                        id: 6,
                        question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
                        options: ["35 cm²", "40 cm²", "45 cm²", "50 cm²"],
                        correct_answer: 1,
                        explanation: "Area = length × width = 8 × 5 = 40 cm²"
                    },
                    {
                        id: 7,
                        question: "What is 25% of 80?",
                        options: ["15", "20", "25", "30"],
                        correct_answer: 1,
                        explanation: "25% of 80 = (25/100) × 80 = 20"
                    },
                    {
                        id: 8,
                        question: "If a dozen eggs cost ₹60, what is the cost of 8 eggs?",
                        options: ["₹35", "₹40", "₹45", "₹50"],
                        correct_answer: 1,
                        explanation: "Cost per egg = 60/12 = ₹5, so 8 eggs = 8 × 5 = ₹40"
                    },
                    {
                        id: 9,
                        question: "What is the next number in the series: 2, 4, 8, 16, ?",
                        options: ["24", "28", "32", "36"],
                        correct_answer: 2,
                        explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
                    },
                    {
                        id: 10,
                        question: "What is 100 - 37?",
                        options: ["63", "67", "73", "77"],
                        correct_answer: 0,
                        explanation: "100 - 37 = 63"
                    }
                ]
            }
        ];

        // Insert sample tests
        for (const testData of sampleTests) {
            const { error } = await supabase
                .from('generated_daily_tests')
                .insert(testData);

            if (error) {
                console.error('Error inserting test:', error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Created ${sampleTests.length} sample daily tests`
        });

    } catch (error) {
        console.error('Error creating sample tests:', error);
        return NextResponse.json(
            { error: 'Failed to create sample tests' },
            { status: 500 }
        );
    }
}