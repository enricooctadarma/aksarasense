FROM python:3.11

WORKDIR /app

COPY . .

ENV TF_ENABLE_ONEDNN_OPTS=0

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 7860

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:7860", "--timeout", "300", "app:app"]