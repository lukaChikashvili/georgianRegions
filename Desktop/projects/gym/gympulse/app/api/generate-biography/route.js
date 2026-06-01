import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const {
      firstName, lastName, birthDate, deathDate,
      profession, hobbies, achievements, personalityTraits,
    } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens:  1500,
      messages: [
        {
          role: "system",
          content: "შენ ხარ თბილი და თანაგრძნობიანი მემორიალის მწერალი. ყოველთვის წერე ქართულ ენაზე.",
        },
        {
          role: "user",
          content: `დაწერე თბილი ბიოგრაფია მემორიალის გვერდისთვის.

პიროვნების დეტალები:
- სახელი გვარი: ${firstName} ${lastName}
- დაბადება: ${birthDate || "უცნობი"}
- გარდაცვალება: ${deathDate || "უცნობი"}
- პროფესია: ${profession || "არ არის მითითებული"}
- ჰობი: ${hobbies || "არ არის მითითებული"}
- მიღწევები: ${achievements || "არ არის მითითებული"}
- ხასიათი: ${personalityTraits || "არ არის მითითებული"}

დაწერე 2-3 პარაგრაფი. იყავი გულთბილი და პირადი.`,
        },
      ],
    });

    const biography = response.choices[0]?.message?.content;
    if (!biography) throw new Error("ბიოგრაფია ვერ დაიწერა");

    return NextResponse.json({ biography });
  } catch (error) {
    console.error("Biography generation error:", error);
    return NextResponse.json(
      { error: "ბიოგრაფიის დაწერა ვერ მოხერხდა" },
      { status: 500 }
    );
  }
}