from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains.combine_documents import create_stuff_documents_chain

load_dotenv()

app = FastAPI(title="Orbital X — Space Mission API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading ML models...")

encoder = joblib.load("models/jelper.pkl")
scaler  = joblib.load("models/hhhh.pkl")


model   = joblib.load("models/snakes.joblib")
print("ML models loaded ✓")
print("Building vector store...")



reader = PdfReader("docs/vertopal.com_Space_Missions_Analysis_(start).pdf")
text   = "".join(page.extract_text() or "" for page in reader.pages)






splitter     = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
chunks       = splitter.split_text(text)
embeddings   = OpenAIEmbeddings(model="text-embedding-3-small")
vector_store = FAISS.from_texts(chunks, embeddings)
retriever    = vector_store.as_retriever(search_kwargs={"k": 6})
print("Vector store ready ✓")




class PredictRequest(BaseModel):
    organisation: str
    country: str
    month: str
    price: float
    rocket_status: int
    year: int

class ChatRequest(BaseModel):
    question: str


LABEL_MAP = {
    0: "Failure",
    1: "Partial Failure",
    2: "Prelaunch Failure",
    3: "Success",
}

COUNTRY_NAMES = {
    "USA": "America", "CHN": "China", "IND": "India", "RUS": "Russia",
    "FRA": "France",  "JPN": "Japan", "NZL": "New Zealand", "KAZ": "Kazakhstan",
}

# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Orbital AI backend is running 🚀"}


@app.post("/predict")
def predict(req: PredictRequest):
    df = pd.DataFrame([{
        "Organisation":            req.organisation,
        "country_alpha_3":         req.country,
        "Month":                   req.month,
        "Price":                   float(req.price),
        "Rocket_Status_numerical": req.rocket_status,
        "Year":                    float(req.year),
    }])

    encoded    = encoder.transform(df)
    scaled     = scaler.transform(encoded)
    value      = int(np.array(model.predict(scaled))[0])
    label      = LABEL_MAP.get(value, "Unknown")
    country_fn = COUNTRY_NAMES.get(req.country, req.country)
    status_str = "currently in use 🟢" if req.rocket_status == 1 else "discontinued 🔴"

    summary = (
        f"The spacecraft launched by {req.organisation} in {country_fn} "
        f"in {req.month} {req.year}, with a pricing of ${req.price:.2f} million, "
        f"is likely to be a {label}. "
        f"The rocket is {status_str}."
    )

    return {
        "result":      label,
        "label_index": value,
        "summary":     summary,
    }


@app.post("/chat")
def chat(req: ChatRequest):
    docs = retriever.invoke(req.question)

    system_msg = SystemMessagePromptTemplate.from_template(
        "You are an expert space mission analyst with complete knowledge of this project, "
        "including its data analysis and the machine learning model deployed to predict "
        "launch outcomes. Answer every question directly, confidently, and authoritatively "
        "as if this knowledge is entirely your own. "
        "NEVER use phrases like 'based on the documents', 'according to the context', "
        "'the document mentions', or 'I believe'. Just answer naturally."
    )
    human_msg = HumanMessagePromptTemplate.from_template(
        "Context:\n{context}\n\nQuestion: {input}"
    )
    prompt = ChatPromptTemplate.from_messages([system_msg, human_msg])
    chain  = create_stuff_documents_chain(ChatOpenAI(temperature=0.4), prompt)

    answer = chain.invoke({"context": docs, "input": req.question})
    return {"answer": answer}
