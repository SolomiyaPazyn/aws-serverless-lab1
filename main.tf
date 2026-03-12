terraform {
  backend "s3" {
    bucket         = "359289023212-terraform-tfstate" 
    key            = "dev/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-tfstate-lock"
  }
}

provider "aws" {
  region = var.region
}

module "dynamodb" {
  source    = "./modules/dynamodb"
  namespace = var.namespace
  stage     = var.stage
  name      = "db"
}

module "iam" {
  source            = "./modules/iam"
  namespace         = var.namespace
  stage             = var.stage
  name              = "iam"
  authors_table_arn = module.dynamodb.authors_table_arn
  courses_table_arn = module.dynamodb.courses_table_arn
}

module "lambda" {
  source             = "./modules/lambda"
  namespace          = var.namespace
  stage              = var.stage
  name               = "lambda"
  authors_table_name = module.dynamodb.authors_table_name
  courses_table_name = module.dynamodb.courses_table_name
  lambda_role_arn    = module.iam.lambda_role_arn
}
