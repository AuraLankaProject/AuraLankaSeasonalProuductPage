# Aura Lanka E-commerce
- Feature: Seasonal Products Page
- IT22339188
- Member 1: Plan + Code

## Task List
- [ ] Design webpage for new seasonal products
- [ ] Create backend API to provide seasonal product data
- [ ] Connect frontend to API
- [ ] Test the page locally in browser
- [ ] Commit and push changes to GitHub

- Feature: Automated CI/CD Deployment
- IT22199362
- Member 3: Release + Deploy
  
## Task List
### Infrastructure
- [ ] AWS EC2 instance setup
- [ ] Security groups configuration
- [ ] SSH key management

### Automation
- [ ] Ansible playbook creation
- [ ] Docker container deployment
- [ ] Server configuration automation

### CI/CD Pipeline
- [ ] Jenkins pipeline integration
- [ ] Automated deployment stage
- [ ] End-to-end testing

## Live Environment
**URL:** http://13.60.215.176  
**Status:** ✅ Production Ready  
**API:** http://13.60.215.176/api/products

## Deployment
```bash
cd ansible
ansible-playbook -i hosts.ini deploy.yml
