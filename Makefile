default: help

.PHONY: help

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ General

upgrade_versions: ## Upgrades to latest versions in package.json
	yarn install && yarn upgrade --latest --exact

build_container: ## Builds allthings/wdio:latest container locally
	docker build --no-cache -t allthings/wdio:latest .
