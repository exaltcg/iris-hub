FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 4000

COPY . .

CMD [ "gunicorn", "-w", "4", "-b", "0.0.0.0:4000", "app:app" ]