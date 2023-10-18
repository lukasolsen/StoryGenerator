from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import multiprocessing
from app.ai import AI

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()

    try:
        yield db
    finally:
        db.close()


class GenerateStoryPayload(BaseModel):
    prompt: str


@app.post("/stories/generate")
def generate_story(prompt: GenerateStoryPayload, db: Session = Depends(get_db)):
    try:
        ai = AI()
        story = ai.generate_story(prompt=prompt.prompt)
        ai.close()

        print(story)
        db_story = models.Story(content=story)
        db.add(db_story)
        db.commit()
        db.refresh(db_story)
        return db_story
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Something went wrong.")


@app.get("/stories/{story_id}")
def read_story(story_id: int, db: Session = Depends(get_db)):
    try:
        db_story = db.query(models.Story).filter(
            models.Story.id == story_id).first()
        if db_story is None:
            raise HTTPException(status_code=404, detail="Story not found")
        return db_story
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Something went wrong.")


@app.get("/stories/")
def read_stories(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        stories = db.query(models.Story).offset(skip).limit(limit).all()
        return stories
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Something went wrong.")


@app.post("/stories/{story_id}/delete")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    try:
        db_story = db.query(models.Story).filter(
            models.Story.id == story_id).first()
        if db_story is None:
            raise HTTPException(status_code=404, detail="Story not found")
        db.delete(db_story)
        db.commit()
        return db_story
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Something went wrong.")


@app.post("/stories/{story_id}/like")
def like_story(story_id: int, db: Session = Depends(get_db)):
    try:
        db_story = db.query(models.Story).filter(
            models.Story.id == story_id).first()
        if db_story is None:
            raise HTTPException(status_code=404, detail="Story not found")
        db_story.likes += 1
        db.commit()
        return db_story
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Something went wrong.")


if __name__ == "main":
    # Check if DB exists
    database.Base.metadata.create_all(bind=database.engine)
