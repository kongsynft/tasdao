import { google } from "googleapis";

export const revalidate = 120;
const sheet_id = "1_4JlqcuhOaygFB3i5AJfbET-kQoSDNH08RTsKNGD6bk";

export async function GET() {
  const sheets = google.sheets({
    version: "v4",
    auth: process.env.GOOGLE_API_KEY,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheet_id,
    range: "A:B",
  });

  const content = response.data.values;

  if (!content) {
    return new Response(JSON.stringify({ error: "No data found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const keySet = new Set([
    "ADAUSD",
    "SOCIETY-minswap",
    "dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25-jpg-floor",
    "d4e087164acf8314f1203f0b0996f14908e2a199a296d065f14b8b09-jpg-floor",
    "fca746f58adf9f3da13b7227e5e2c6052f376447473f4d49f8004195-jpg-floor",
  ]);

  const contentMap = new Map();
  const missingKeys: string[] = [];

  keySet.forEach((key) => {
    const foundRow = content.find((row) => row.includes(key));
    if (foundRow) {
      contentMap.set(key, foundRow);
    } else {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    return new Response(
      JSON.stringify({ error: "Required data not found for: ", missingKeys }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const result = {
    ADAUSD: contentMap.get("ADAUSD")[1],
    SOCADA: contentMap.get("SOCIETY-minswap")[1],
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
