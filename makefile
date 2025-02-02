ifeq ($(OS),Windows_NT)
  CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
else ifeq ($(shell uname), Darwin)
  CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
else
  CHROME_PATH='/snap/bin/chromium'
endif

run: run-backend run-chrome

run-backend:
	docker-compose up -d

stop-backend:
	docker-compose down

run-chrome:
	@$(CHROME_PATH) --ignore-certificate-errors http://localhost:3000 &
	
stop-chrome:
	CHROME_PIDS=$$(ps aux | grep -- '--ignore-certificate-errors' | grep -v grep | awk '{print $$2}'); \
	if [ ! -z "$$CHROME_PIDS" ]; then kill $$CHROME_PIDS; fi

stop: stop-backend stop-chrome