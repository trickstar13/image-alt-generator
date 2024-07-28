import { Buffer } from "buffer";
import sharp from "sharp";

export const POST = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "Image file is missing" }), {
        status: 400,
      });
    }

    const fileArrayBuffer = await (imageFile as Blob).arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);

    // MIMEタイプを判定
    const mimeType = (imageFile as Blob).type;
    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!supportedTypes.includes(mimeType)) {
      return new Response(JSON.stringify({ error: "Unsupported image type" }), {
        status: 400,
      });
    }

    const resizedBuffer = await sharp(buffer)
      .resize({ width: 800, height: 600, fit: "inside" })
      .toBuffer();

    const base64Image = resizedBuffer.toString("base64");
    const apiKey = import.meta.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${apiKey}`,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType,
                  data: base64Image,
                },
              },
              {
                type: "text",
                text: "画像のaltを日本語で書いてください。altのみを返して、余計な文章はつけないでください。",
              },
            ],
          },
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API request failed:", errorData);
      return new Response(
        JSON.stringify({
          error: `API request failed: ${errorData.error.message}`,
        }),
        { status: response.status },
      );
    }

    const data = await response.json();
    const altText = data.content[0].text;

    if (!altText) {
      return new Response(
        JSON.stringify({ error: "Failed to generate alt text" }),
        { status: 500 },
      );
    }

    // 実際のトークン数を取得
    const inputTokens = data.usage.input_tokens;
    const outputTokens = data.usage.output_tokens;

    // コスト計算
    const costPerTokenInput = 3 / 1000000; // 100万トークンあたり3ドル
    const costPerTokenOutput = 15 / 1000000; // 100万トークンあたり15ドル
    const totalCostUSD =
      inputTokens * costPerTokenInput + outputTokens * costPerTokenOutput;
    const exchangeRate = 152.94; // 1 USD = 152.94 JPY
    const totalCostJPY = totalCostUSD * exchangeRate;

    return new Response(
      JSON.stringify({ alt: altText, cost: totalCostJPY.toFixed(2) }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
    });
  }
};
