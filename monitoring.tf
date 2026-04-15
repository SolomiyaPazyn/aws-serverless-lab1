# 1. Створення топіка SNS для сповіщень
resource "aws_sns_topic" "lambda_alarms" {
  name = "cloudtech-dev-lambda-alarms"
}

# 2. Підписка на Email
resource "aws_sns_topic_subscription" "email_target" {
  topic_arn = aws_sns_topic.lambda_alarms.arn
  protocol  = "email"
  endpoint  = "solomiya.pazyn.school91@gmail.com" # ЗАМІНИ НА СВОЮ ПОШТУ
}

# 3. Список функцій для моніторингу}
locals {
  monitored_functions = [
    "cloudtech-dev-lambda-get-all-courses",
    "cloudtech-dev-lambda-get-all-authors"
  ]
}

# 4. Створення алярмів (Errors >= 1)
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  for_each            = toset(local.monitored_functions)
  alarm_name          = "${each.key}-error-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Alarm for function ${each.key} errors"

  dimensions = {
    FunctionName = each.key
  }

  alarm_actions = [aws_sns_topic.lambda_alarms.arn]
}
