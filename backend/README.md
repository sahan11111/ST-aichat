# Backend (FastAPI)

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit values
uvicorn app.main:app --reload
```

- API docs: http://localhost:8000/docs
- Health:   http://localhost:8000/health
- Tests:    `pytest`

Tables are auto-created on startup for local development. For production use Alembic (`alembic upgrade head`).
