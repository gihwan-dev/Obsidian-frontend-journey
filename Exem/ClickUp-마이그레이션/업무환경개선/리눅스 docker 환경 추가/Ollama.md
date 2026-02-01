# 🚫 Ollama

## Ollama container run

```bash
docker run -d -v /home/dpm-fe/ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

## llama2 모델 실행

```bash
docker exec -it ollama ollama run llama2
```

## 참고 링크
- [Ollama is now available as an official Docker image](https://ollama.com/blog/ollama-is-now-available-as-an-official-docker-image)

## 종희 상무님이 자원이 좋은 서버에서 Ollama 를 구동중이셔서 팀내 Ollama 는 중지
- AI GPU Host 참고

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1741118*
