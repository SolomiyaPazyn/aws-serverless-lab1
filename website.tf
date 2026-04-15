resource "aws_s3_bucket" "webapp" {
  bucket        = "cloudtech-dev-webapp-static-site"
  force_destroy = true
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for cloudtech-dev-webapp-static-site"
}

resource "aws_cloudfront_distribution" "webapp_distribution" {
  origin {
    domain_name = aws_s3_bucket.webapp.bucket_regional_domain_name
    origin_id   = "S3-cloudtech-dev-webapp-static-site"
    s3_origin_config {
      # Тут був обірваний рядок, тепер він виправлений:
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-cloudtech-dev-webapp-static-site"
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Цей блок тепер розбитий на кілька рядків, щоб не було помилки:
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_s3_bucket_policy" "webapp_policy" {
  bucket = aws_s3_bucket.webapp.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = "s3:GetObject"
      Effect   = "Allow"
      Principal = { AWS = aws_cloudfront_origin_access_identity.oai.iam_arn }
      Resource = "${aws_s3_bucket.webapp.arn}/*"
    }]
  })
}

resource "aws_s3_bucket_website_configuration" "webapp_config" {
  bucket = aws_s3_bucket.webapp.id
  index_document { suffix = "index.html" }
  error_document { key = "index.html" }
}

output "website_url" {
  value = "https://${aws_cloudfront_distribution.webapp_distribution.domain_name}"
}
