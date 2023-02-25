# Week 2 — Distributed Tracing

# Required Homework

## Live Video notes

**Issues**

- Not getting the data in Honeycomb bootcamp, just in Honeycomb test
- After a few docker compose down & up and closing Gitpod workspace and starting new ones and setting the env var HONEYCOMB_API_KEY again, I’ve got data in Honeycomb bootcamp space.

**Yaaaas!**

![honeycomb_bootcamp_receiving_data](./assets/week2_honeycomb_bootcamp_data.png)

**Resources**

[https://www.youtube.com/watch?v=2GD9xCzRId4](https://www.youtube.com/watch?v=2GD9xCzRId4)

- Open Telemetry OTEL for observability [opentelemetry.io](http://opentelemetry.io) or [cncf.io](http://cncf.io) Cloud Native Computing Foundation

Observability

- My cloud sends standardized messages to honeycomb who stores them in databases for viewing and investigation
- No same dockerfile because you want different base images - one for development, one for production

Honeycomb

- Docs [https://docs.honeycomb.io/getting-data-in/opentelemetry/python/](https://docs.honeycomb.io/getting-data-in/opentelemetry/python/)
- Checking the honeycomb API key [https://honeycomb-whoami.glitch.me/](https://honeycomb-whoami.glitch.me/)