FROM python:3.10

WORKDIR /app

COPY . /app

ENV TF_ENABLE_ONEDNN_OPTS=0

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 7860

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:7860", "--timeout", "120", "app:app"]