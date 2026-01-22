# Grafana dashboard

## install 
`uv sync`
`docker compose up -d`

## run
`uv run robot --xunit output.xml --outputdir results test_suite.robot`
`uv run python upload_results.py results/output.xml`