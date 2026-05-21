# SRE Concepts Website Infrastructure

This repository hosts the static frontend code and the Infrastructure as Code (IaC) configuration for **[SREConcepts.com](https://sreconcepts.com)**. The platform is designed for maximum availability, globally distributed edge caching, and automated edge mitigation.

## 🏗️ Architecture Overview

The infrastructure leverages a fully serverless, highly resilient cloud-native stack deployed on AWS.

                            [ Custom Web ACL ]
                                      │
                                      ▼
 [ User ] ──►[ Route 53 ] ──► [ CloudFront CDN ] ──► [ S3 Bucket ]
  (DNS)       (Edge Cache)       (Static Host)                                     

* **Content Delivery Network (CDN):** Amazon CloudFront routes global user traffic to the nearest Edge Location, optimizing Time to First Byte (TTFB).
* **Storage Origin:** Amazon S3 with Static Website Hosting enabled, protected via strict bucket policies restricting direct public access outside the CDN pathway.
* **DNS & Routing:** Amazon Route 53 managing public hosted zones with optimized alias `A` records pointing directly to the CloudFront distribution.
* **Edge Security Layer:** AWS WAF (Web Application Firewall) directly attached to the CloudFront distribution to inspect and drop malicious application payloads before they hit the origin.

---

## 🛡️ Edge Security & Web ACL Configuration

The application is protected by a tailored AWS WAF Web ACL containing **4 specific rules** designed to balance threat mitigation with deep visibility:

| Rule Name | Type | Action / Mode | Operational Objective |
| :--- | :--- | :--- | :--- |
| **`AWSManagedRulesAmazonIpReputationList`** | Managed | **COUNT** | Tracks and logs requests originating from known malicious IPs, botnets, and spammers for observability without dropped traffic. |
| **`AWSManagedRulesCommonRuleSet`** | Managed | **COUNT** | Monitors traffic against OWASP Top 10 vulnerabilities (e.g., local file inclusion, large payloads) to log anomalous behavior. |
| **`AWSManagedRulesKnownBadInputsRuleSet`** | Managed | **COUNT** | Inspects request headers and URI pathways for invalid or malicious input patterns (e.g., exploitation attempts). |
| **`rate-limit-100-per-5-minutes`** | Custom | **BLOCK (429)** | Mitigates Layer 7 Distributed Denial of Service (DDoS) and aggressive brute-force scanning by throttling IPs exceeding 100 requests per 5 minutes. |
