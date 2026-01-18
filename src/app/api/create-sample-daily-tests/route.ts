import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();

        // Sample daily tests data
        const sampleDailyTests = [
            {
                title: 'Daily Practice - SSC General Knowledge',
                exam_category: 'SSC',
                subject: 'General Knowledge',
                difficulty: 'easy',
                questions_count: 10,
                duration_minutes: 15,
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
                    },
                    {
                        id: "6",
                        question: "In which year did India gain independence?",
                        options: ["1945", "1946", "1947", "1948"],
                        correct_answer: 2,
                        explanation: "India gained independence on August 15, 1947."
                    },
                    {
                        id: "7",
                        question: "What is the currency of India?",
                        options: ["Dollar", "Rupee", "Pound", "Euro"],
                        correct_answer: 1,
                        explanation: "The Indian Rupee (INR) is the official currency of India."
                    },
                    {
                        id: "8",
                        question: "Which is the largest state in India by area?",
                        options: ["Maharashtra", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh"],
                        correct_answer: 2,
                        explanation: "Rajasthan is the largest state in India by area."
                    },
                    {
                        id: "9",
                        question: "Who is known as the Father of the Nation in India?",
                        options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"],
                        correct_answer: 1,
                        explanation: "Mahatma Gandhi is known as the Father of the Nation in India."
                    },
                    {
                        id: "10",
                        question: "What is the national bird of India?",
                        options: ["Eagle", "Peacock", "Parrot", "Sparrow"],
                        correct_answer: 1,
                        explanation: "The Peacock is the national bird of India."
                    }
                ]
            },
            {
                title: 'Daily Practice - Railway General Science',
                exam_category: 'Railway',
                subject: 'General Science',
                difficulty: 'medium',
                questions_count: 10,
                duration_minutes: 15,
                test_date: new Date().toISOString().split('T')[0],
                status: 'published',
                questions: [
                    {
                        id: "1",
                        question: "What is the chemical formula of water?",
                        options: ["H2O", "CO2", "NaCl", "HCl"],
                        correct_answer: 0,
                        explanation: "Water has the chemical formula H2O, consisting of two hydrogen atoms and one oxygen atom."
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
                        question: "Which organ in the human body produces insulin?",
                        options: ["Liver", "Kidney", "Pancreas", "Heart"],
                        correct_answer: 2,
                        explanation: "The pancreas produces insulin, which regulates blood sugar levels."
                    },
                    {
                        id: "5",
                        question: "What is the atomic number of carbon?",
                        options: ["4", "6", "8", "12"],
                        correct_answer: 1,
                        explanation: "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus."
                    },
                    {
                        id: "6",
                        question: "Which planet is closest to the Sun?",
                        options: ["Venus", "Earth", "Mercury", "Mars"],
                        correct_answer: 2,
                        explanation: "Mercury is the closest planet to the Sun in our solar system."
                    },
                    {
                        id: "7",
                        question: "What type of energy is stored in a battery?",
                        options: ["Kinetic", "Potential", "Chemical", "Nuclear"],
                        correct_answer: 2,
                        explanation: "Batteries store chemical energy which is converted to electrical energy."
                    },
                    {
                        id: "8",
                        question: "Which blood group is known as the universal donor?",
                        options: ["A", "B", "AB", "O"],
                        correct_answer: 3,
                        explanation: "Blood group O is known as the universal donor because it can donate to all other blood groups."
                    },
                    {
                        id: "9",
                        question: "What is the hardest natural substance on Earth?",
                        options: ["Gold", "Iron", "Diamond", "Platinum"],
                        correct_answer: 2,
                        explanation: "Diamond is the hardest natural substance on Earth."
                    },
                    {
                        id: "10",
                        question: "Which force keeps planets in orbit around the Sun?",
                        options: ["Magnetic force", "Gravitational force", "Electric force", "Nuclear force"],
                        correct_answer: 1,
                        explanation: "Gravitational force keeps planets in orbit around the Sun."
                    }
                ]
            }
        ];

        const createdTests = [];

        for (const testData of sampleDailyTests) {
            // Insert daily test
            const { data: test, error: testError } = await supabase
                .from('generated_daily_tests')
                .insert(testData)
                .select()
                .single();

            if (testError) {
                console.error('Error inserting daily test:', testError);
                continue;
            }

            createdTests.push(test);
        }

        return NextResponse.json({
            success: true,
            message: `Created ${createdTests.length} sample daily tests`,
            tests: createdTests
        });

    } catch (error) {
        console.error('Error creating sample daily tests:', error);
        return NextResponse.json(
            { error: 'Failed to create sample daily tests', details: error },
            { status: 500 }
        );
    }
}