# Week 0 — Billing and Architecture

**Freestyle notes**

Installed all technologies pre-requisites.
Bought domain via Route 53.
My heart jumped when I saw all my budgets and alarms showing Exceeding Limit, until I've remembered it's because of the domain I bought. The mystery continued for a bit as the $$ bill still wasn't what I expected - of course! I've got the default hosted zone that gets assigned to the domain, so had to remove that.

Took me a bit to figure out I need to install the Gitpod browser extension to see the Gitpod button in Github and avoid using gitpod.io/#.

I've done most tasks via the CLI first, for example I've created a billing alarm via AWS browser interface after creating from the CLI so I had an SNS already. 

Enabled MFA everywhere :) and started using IAM user for most things.

Had to give IAM user permissions for billing access so IAM user can see budgets - https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_billing.html?icmpid=docs_iam_console#tutorial-billing-step1.

Had to enable cost center so I can select more than one budget type (i.e. Cost budget - Recommended) for the Customize (advanced) budget setup.

Wanted to understand the various types of costs - https://aws.amazon.com/blogs/aws-cloud-financial-management/understanding-your-aws-cost-datasets-a-cheat-sheet/ - unblended sounded like the one to choose for my context.

Cost allocation tags - there were none in my account - was not covered how to create them - I have no resources created either which would require tagging. 

Created various other tags while following through the Security video and creating an AWS Organisation, Service Control Policies. I had to enable Organization SCP which resulted in only FullAWSAccess policy being listed (different from video content).

Enabled AWS CloudTrail - must monitor this for any expense risk.

Created the conceptual and logic diagrams - https://lucid.app/lucidchart/44e11662-de4e-4635-a880-eb94402eba0d/edit?invitationId=inv_8a7147b0-5264-43e2-a3d7-6f8af639e2a0&page=0_0#

**Step by Step**