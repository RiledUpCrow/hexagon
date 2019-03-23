workflow "CI" {
  on = "push"
  resolves = ["Deploy"]
}

action "Build" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  args = "build --target dev -t co0sh/hexagon-ui:dev ."
}

action "Login" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Style" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build"]
  args = "run --rm co0sh/hexagon-ui:dev npm run style"
}

action "Lint" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build"]
  args = "run --rm co0sh/hexagon-ui:dev npm run lint"
}

action "Test" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build"]
  args = "run --rm co0sh/hexagon-ui:dev npm run test"
}

action "Release" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Style", "Lint", "Test"]
  args = "build -t co0sh/hexagon-ui:latest ."
}

action "Push" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Release", "Login"]
  args = "push co0sh/hexagon-ui:latest"
}

action "Deploy" {
  uses = "maddox/actions/ssh@master"
  needs = ["Push"]
  args = "~/deploy-ui.sh"
  secrets = [
    "PRIVATE_KEY",
    "PUBLIC_KEY",
    "HOST",
    "USER",
  ]
}
