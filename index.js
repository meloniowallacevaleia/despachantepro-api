import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { PDFDocument, StandardFonts } from "pdf-lib";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const PORT = process.env.PORT || 8787;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.BUCKET || "documentos";

const headers = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
};

async function sbUpload(path, bytes) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...headers, "x-upsert": "true", "Content-Type": "application/pdf" },
    body: bytes,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return { path };
}

app.get("/", (req, res) => {
  res.json({ ok: true, service: "DespachantePro API online" });
});

app.post("/api/pdf/generate", async (req, res) => {
  try {
    const { cliente, outorgados = [], texto = "", gerarDeclaracao = true } = req.body;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([595, 842]);
    let y = 800;
    const draw = (txt, x = 50, size = 11) => {
      page.drawText(txt, { x, y, size, font });
      y -= 14;
    };
    draw("PROCURAÇÃO PARTICULAR", 200, 14);
    draw(`Nome: ${cliente?.nome || ""}`);
    draw(`CPF: ${cliente?.cpf || ""}`);
    draw(`Placa: ${cliente?.placa || ""}`);
    draw("Documento gerado automaticamente - DespachantePro");
    const bytes = await pdfDoc.save();
    const path = `gerados/${cliente?.nome || "cliente"}_${cliente?.placa || "placa"}.pdf`;
    await sbUpload(path, Buffer.from(bytes));
    res.json({ ok: true, path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`API DespachantePro rodando na porta ${PORT}`));
