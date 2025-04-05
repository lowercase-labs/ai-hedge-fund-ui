from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Analysis(Base):
    __tablename__ = 'analyses'

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), nullable=True)  # For future user authentication
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    parameters = Column(JSON, nullable=False)
    results = Column(JSON, nullable=True)
    status = Column(String(20), nullable=False, default='in_progress')
    error_message = Column(Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'title': self.title,
            'description': self.description,
            'parameters': self.parameters,
            'results': self.results,
            'status': self.status,
            'error_message': self.error_message
        } 