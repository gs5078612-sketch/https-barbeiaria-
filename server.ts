import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// ==========================================
// API Endpoints for Client Memory AI
// ==========================================

// 1. Analyze Client Memory & Generate Visagism Diagnostic
app.post('/api/ai/analyze-client', async (req, res) => {
  try {
    const { client } = req.body;
    if (!client) {
      return res.status(400).json({ error: 'Client data is required' });
    }

    if (aiClient) {
      const prompt = `Você é o Diretor Técnico e Visagista Chefe da barbearia de luxo "Império Barber".
Analise o perfil e o histórico de memória deste cliente para gerar um diagnóstico de visagismo e atendimento exclusivo para o barbeiro.

Dados do Cliente:
Nome: ${client.name}
Telefone: ${client.phone}
Total de visitas: ${client.totalVisits}
Barbeiro preferido: ${client.preferredBarberName}
Bebida preferida: ${client.favoriteDrink || 'Não especificada'}
Perfil de Cabelo: ${client.hairProfile || 'Cabelo masculino padrão'}
Perfil de Pele: ${client.skinProfile || 'Pele masculina padrão'}
Notas do atendimento: ${client.conversationNotes || 'Sem observações'}
Histórico recente de serviços: ${JSON.stringify(client.serviceHistory || [])}

Gere uma resposta em texto formatada com elegância contendo:
1. Resumo do Perfil & Comportamento (1 parágrafo)
2. Recomendação de Visagismo & Estilo para o Barbeiro aplicar na bancada
3. Cuidados Especiais (pele, navalha, produtos sugeridos)
4. Sugestão da próxima data ideal de retorno (em dias).

Seja profissional, executivo e focado no acolhimento de alta linha da barbearia.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ analysis: response.text });
    } else {
      // High-quality fallback for full independence
      const fallbackAnalysis = `### Diagnóstico de Visagismo & Memória IA — Império Barber
**Perfil do Cliente:** ${client.name} é um cliente com padrão executivo exigente. Valoriza pontualidade e o ritual clássico.
**Diretriz para a Bancada (${client.preferredBarberName}):** Manter transição limpa nas laterais e proporção equilibrada no topo. Na barba, respeitar a simetria mandibular.
**Cuidados & Sensibilidade:** ${client.skinProfile || 'Aplicar óleo essencial pré-barba e toalha vaporizada para evitar irritação'}. Acomodar com ${client.favoriteDrink || 'café expresso moído na hora'}.
**Previsão de Retorno:** Intervalo recomendado de 18 a 21 dias para manutenção perfeita do degradê e alinhamento facial.`;
      return res.json({ analysis: fallbackAnalysis });
    }
  } catch (error) {
    console.error('Error analyzing client with AI:', error);
    return res.status(500).json({
      error: 'Falha ao analisar cliente com IA',
      fallback: `Diagnóstico automático: Cliente frequente (${req.body?.client?.name}). Recomenda-se manter o alinhamento com ${req.body?.client?.preferredBarberName} e aplicar a barboterapia com toalha quente.`
    });
  }
});

// 2. Generate Personalized Re-engagement WhatsApp Message
app.post('/api/ai/whatsapp-reengagement', async (req, res) => {
  try {
    const { client, daysSinceLastVisit } = req.body;
    if (!client) {
      return res.status(400).json({ error: 'Client data is required' });
    }

    if (aiClient) {
      const prompt = `Você é o concierge da barbearia de luxo "Império Barber".
Crie uma mensagem curta, educada, personalizada e persuasiva para enviar pelo WhatsApp para o cliente:
Nome: ${client.name}
Barbeiro preferido: ${client.preferredBarberName}
Último serviço: ${client.lastService || 'Corte Imperial'}
Dias desde a última visita: ${daysSinceLastVisit || 20} dias
Bebida preferida: ${client.favoriteDrink || 'café especial'}

Regras da mensagem:
- Máximo 3 a 4 parágrafos curtos.
- Tom refinado, caloroso e cavalheiresco (sem gírias exageradas).
- Mencione que o barbeiro ${client.preferredBarberName} tem horários reservados esta semana e que o café/bebida favorita dele estará pronto na recepção.
- Inclua um convite discreto para agendar.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ message: response.text });
    } else {
      const msg = `Olá, ${client.name}! Tudo bem?

Aqui é o concierge da Império Barber. Notamos que faz cerca de ${daysSinceLastVisit || 20} dias desde o seu último corte e queríamos garantir que você mantenha seu alinhamento impecável para os próximos compromissos.

O ${client.preferredBarberName} já separou a bancada e seu ${client.favoriteDrink || 'café especial'} favorito estará te esperando na nossa recepção.

Gostaria de reservar seu horário para esta semana? Estamos à disposição!`;
      return res.json({ message: msg });
    }
  } catch (error) {
    console.error('Error generating WhatsApp message:', error);
    return res.status(500).json({
      error: 'Falha ao gerar mensagem',
      fallback: `Olá, ${req.body?.client?.name}! Passando para lembrar que já fazem alguns dias desde o seu último corte na Império Barber. Que tal agendar seu horário com o ${req.body?.client?.preferredBarberName}?`
    });
  }
});

// 3. AI Visagism Consultant for Clients / Barbers
app.post('/api/ai/visagism-consultant', async (req, res) => {
  try {
    const { question, clientContext } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (aiClient) {
      const prompt = `Você é o Consultor Especialista em Visagismo Masculino e Cuidados Pessoais da "Império Barber".
Responda à dúvida abaixo com alto conhecimento técnico sobre cortes masculinos (fade, taper, social, pompadour, mullet moderno), formato de rosto (oval, quadrado, triangular, redondo), tipos de barba, barboterapia e cuidados capilares.

Contexto do cliente (se houver): ${JSON.stringify(clientContext || {})}
Pergunta: "${question}"

Responda de forma prática, elegante e com dicas aplicáveis na rotina do cliente.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ answer: response.text });
    } else {
      return res.json({
        answer: `Para harmonizar o visual masculino, recomendamos avaliar o formato do maxilar e a direção dos redemoinhos capilares. Se o rosto for mais angular, o corte degradê médio (Mid Fade) com textura no topo suaviza os traços mantendo a imponência. Na barba, a barboterapia com toalha quente prepara a derme e evita foliculite, garantindo simetria perfeita.`
      });
    }
  } catch (error) {
    console.error('Error in visagism consultant:', error);
    return res.status(500).json({
      error: 'Erro no consultor IA',
      fallback: 'O visagismo da Império Barber busca realçar a personalidade de cada cliente. Recomendamos consultar nossos mestres barbeiros na bancada para um alinhamento individual.'
    });
  }
});

// ==========================================
// Vite Middleware setup for Full-Stack App
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
