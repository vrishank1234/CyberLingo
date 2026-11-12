# CyberLingo Content Format & Schema Guide

This document defines the JSON structure for courses in CyberLingo. All lesson content is authored in JSON files under `/content/<trackId>.json`, validated via `npm run content:validate`, and seeded to Firestore via `npm run content:seed`.

---

## 1. Hierarchy

```
Track (trackId)
  └── Units [ { unitId, title, order, color, guidebook, lessons: [...] } ]
        └── Lessons [ { lessonId, title, order, exercises: [...] } ]
              └── Exercises [ { id, type, prompt, explanation, ... } ]
```

### Constraints:
* Each track must have a unique `trackId` and `version` integer.
* Each unit must have a unique `unitId` and a valid hex `color` (e.g. `#58CC02`).
* Each lesson must have between **8 and 15 exercises**.
* Exercise IDs must be unique across the entire track.
* All exercise answer indices must be valid options within their respective arrays.

---

## 2. Exercise Types

CyberLingo supports **10 cybersecurity-adapted exercise types**:

### 1. `multiple_choice`
One correct option from 3-4 choices.
```json
{
  "id": "sec-fund-u1-l1-e1",
  "type": "multiple_choice",
  "prompt": "Which principle of the CIA Triad ensures sensitive data is kept secret from unauthorized access?",
  "options": ["Integrity", "Confidentiality", "Availability", "Authenticity"],
  "answer": 1,
  "explanation": "Confidentiality restricts data access strictly to authorized individuals and processes."
}
```

### 2. `multi_select`
Multiple correct options from 4-5 choices.
```json
{
  "id": "sec-fund-u1-l1-e2",
  "type": "multi_select",
  "prompt": "Select all essential habits for creating and maintaining strong passwords:",
  "options": [
    "Using at least 16 mixed characters",
    "Writing your password on a sticky note under your keyboard",
    "Using a reputable password manager",
    "Reusing your master password on social media accounts",
    "Enabling multi-factor authentication (MFA)"
  ],
  "answer": [0, 2, 4],
  "explanation": "Length, password managers, and MFA provide strong authentication defense. Never write down or reuse passwords."
}
```

### 3. `true_false`
Statement evaluation returning boolean true or false.
```json
{
  "id": "sec-fund-u1-l1-e3",
  "type": "true_false",
  "prompt": "A padlock icon in the browser address bar (HTTPS) guarantees that a website is completely trustworthy and free of scams.",
  "answer": false,
  "explanation": "HTTPS only encrypts traffic in transit. Phishing sites and malicious domains can easily obtain valid SSL/TLS certificates."
}
```

### 4. `fill_blank`
Sentence with a missing keyword to be filled from a word bank.
```json
{
  "id": "sec-fund-u1-l1-e4",
  "type": "fill_blank",
  "prompt": "Complete the security concept:",
  "sentence": "A ___ encrypts network traffic to create a secure tunnel across untrusted public Wi-Fi.",
  "wordBank": ["VPN", "Firewall", "Router", "Switch"],
  "answer": ["VPN"],
  "explanation": "A Virtual Private Network (VPN) creates an encrypted tunnel protecting network traffic from eavesdroppers."
}
```

### 5. `match_pairs`
Matching technical terms or threats to their definitions or countermeasures.
```json
{
  "id": "sec-fund-u1-l1-e5",
  "type": "match_pairs",
  "prompt": "Match each cybersecurity threat to its description:",
  "pairs": [
    ["Phishing", "Fraudulent communication that steals credentials"],
    ["Ransomware", "Malware encrypting files until a ransom is paid"],
    ["DDoS Attack", "Overwhelming a service with distributed traffic"],
    ["Spyware", "Covertly recording keystrokes and user activity"]
  ],
  "explanation": "Understanding core threat definitions helps incident responders recognize attack vectors."
}
```

### 6. `order_steps`
Sequence of procedural steps arranged in the proper chronological order (stored in correct order, randomized on client).
```json
{
  "id": "sec-fund-u1-l1-e6",
  "type": "order_steps",
  "prompt": "Arrange the standard NIST Incident Response phases in chronological order:",
  "steps": [
    "Preparation",
    "Detection and Analysis",
    "Containment, Eradication & Recovery",
    "Post-Incident Activity"
  ],
  "explanation": "The NIST SP 800-61 framework begins with Preparation and concludes with Lessons Learned."
}
```

### 7. `scenario`
Real-world operational cybersecurity story requiring a tactical decision.
```json
{
  "id": "sec-fund-u1-l1-e7",
  "type": "scenario",
  "context": "You receive an urgent message from 'IT Support' stating your laptop has been compromised and requesting remote access credentials within 10 minutes to prevent suspension.",
  "prompt": "What is your immediate best response?",
  "options": [
    "Immediately grant remote access to prevent suspension",
    "Reply with your login details but change them tomorrow",
    "Verify the request through official out-of-band channels and report it to InfoSec",
    "Forward the email to all colleagues to ask if they received it too"
  ],
  "answer": 2,
  "explanation": "Urgency and fear are classic social engineering tactics. Always verify unusual requests out-of-band."
}
```

### 8. `spot_the_threat`
Interactive inspection of an email header, URL, or code snippet where the user taps the deceptive or malicious indicator.
```json
{
  "id": "sec-fund-u1-l1-e8",
  "type": "spot_the_threat",
  "prompt": "Inspect this suspicious email header. Tap the red flag indicator:",
  "threatData": {
    "senderDisplay": "Google Security Team",
    "senderEmail": "security-alert@g00gle-accounts-verify.com",
    "subject": "Urgent: Unauthorized Login Attempt from Moscow",
    "body": "Your account was accessed from an unrecognized device. Click below to verify your identity.",
    "targets": [
      { "id": "t1", "text": "Google Security Team", "isThreat": false },
      { "id": "t2", "text": "security-alert@g00gle-accounts-verify.com", "isThreat": true },
      { "id": "t3", "text": "Urgent: Unauthorized Login", "isThreat": false }
    ]
  },
  "answer": "t2",
  "explanation": "The sender domain 'g00gle-accounts-verify.com' uses typosquatting and is not an authentic Google domain."
}
```

### 9. `command_complete`
Construct an essential cybersecurity CLI tool command by tapping tokens into place.
```json
{
  "id": "sec-fund-u1-l1-e9",
  "type": "command_complete",
  "prompt": "Construct the Nmap command to perform service version detection on target 192.168.1.50:",
  "targetCommand": "nmap -sV 192.168.1.50",
  "wordBank": ["nmap", "-sV", "-sS", "192.168.1.50", "-p80", "ping"],
  "answer": ["nmap", "-sV", "192.168.1.50"],
  "explanation": "The `-sV` flag enables service and version detection on listening network ports."
}
```

### 10. `info_card`
Instructional visual card introducing a foundational concept before exercises begin (requires no answer).
```json
{
  "id": "sec-fund-u1-l1-e10",
  "type": "info_card",
  "title": "Defense in Depth",
  "content": "Defense in Depth is a strategy that leverages multiple defensive layers (firewalls, MFA, encryption, endpoint detection) to protect assets so that if one layer fails, others stop the breach.",
  "keyTakeaway": "Never rely on a single defensive control."
}
```
