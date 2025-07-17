# Contributing to Smart Code Assistant Docker Offload Demo

Thank you for your interest in contributing to this project! This guide will help you get started with contributing to the Smart Code Assistant Docker Offload demonstration.

## 🎯 Project Overview

This project demonstrates the practical application of Docker Offload for AI/ML workloads, specifically showcasing when and how to transition from local development to cloud-powered infrastructure for code assistance applications.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## 🚀 Getting Started

### Prerequisites

- Docker Desktop 4.43.0+ with Docker Offload feature
- Node.js 18+ and npm (for frontend development)
- Python 3.9+ (for backend development)
- Git
- Basic understanding of React, FastAPI, and Docker

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/smart-code-assistant-docker-offload.git
   cd smart-code-assistant-docker-offload
   ```

2. **Run Setup Script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Test the Environment**
   ```bash
   make test
   ```

## 🛠️ Development Setup

### Backend Development

1. **Set up Python environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Run backend in development mode**
   ```bash
   make dev-backend
   # or manually:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Development

1. **Set up Node.js environment**
   ```bash
   cd frontend
   npm install
   ```

2. **Run frontend in development mode**
   ```bash
   make dev-frontend
   # or manually:
   npm start
   ```

### Docker Development

```bash
# Build and run locally
make local

# Build and run with Docker Offload
make offload

# View logs
make logs

# Health check
make health
```

## 📖 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Reports**: Found a bug? Please report it!
- 🚀 **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 🧪 **Testing**: Add or improve tests
- 💻 **Code**: Bug fixes, features, optimizations
- 🎨 **UI/UX**: Design improvements
- 📊 **Performance**: Benchmarks and optimizations

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Create an issue** for major changes to discuss approach
3. **Fork the repository** and create a feature branch
4. **Follow coding standards** outlined below

### Issue Guidelines

When creating issues, please include:

- **Clear title** and description
- **Steps to reproduce** (for bugs)
- **Expected vs actual behavior**
- **Environment details** (OS, Docker version, etc.)
- **Screenshots** if applicable
- **Labels** for categorization

## 🎨 Code Style

### Backend (Python)

- Follow **PEP 8** style guidelines
- Use **type hints** for function parameters and returns
- Write **docstrings** for functions and classes
- Use **async/await** for I/O operations
- Keep functions **small and focused**

```python
# Good example
async def complete_code(request: CodeRequest) -> CodeResponse:
    """
    Generate code completion using the configured model.
    
    Args:
        request: Code completion request with input text
        
    Returns:
        Code completion response with generated text and metadata
    """
    start_time = time.time()
    # Implementation here
    return CodeResponse(...)
```

### Frontend (TypeScript/React)

- Use **TypeScript** for type safety
- Follow **React Hooks** patterns
- Use **functional components** over class components
- Implement **proper error handling**
- Write **accessible** UI components

```typescript
// Good example
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, placeholder }) => {
  // Implementation here
};
```

### Docker

- Use **multi-stage builds** for optimization
- Minimize **layer count** and **image size**
- Include **health checks**
- Use **specific tags** instead of `latest`
- Add **labels** for metadata

### Documentation

- Use **clear, concise language**
- Include **code examples**
- Add **screenshots** for UI changes
- Update **relevant docs** with changes
- Follow **markdown standards**

## 🧪 Testing

### Running Tests

```bash
# Run all tests
make test

# Run specific test script
./scripts/test.sh

# Test specific environment
make local && make test
make offload && make test
```

### Writing Tests

- **Unit tests** for individual functions
- **Integration tests** for API endpoints
- **E2E tests** for complete workflows
- **Performance tests** for benchmarking

### Test Requirements

- All new features must include tests
- Maintain or improve test coverage
- Tests should be reliable and fast
- Mock external dependencies

## 📤 Submitting Changes

### Pull Request Process

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following code style guidelines

3. **Add tests** for new functionality

4. **Update documentation** as needed

5. **Test your changes**
   ```bash
   make test
   make local  # Test local environment
   make offload  # Test Docker Offload (if available)
   ```

6. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add GPU memory optimization for large models"
   ```

7. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Guidelines

- **Clear title** describing the change
- **Detailed description** of what and why
- **Link related issues** using keywords (fixes #123)
- **Include screenshots** for UI changes
- **Add breaking change notes** if applicable
- **Request review** from maintainers

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(frontend): add performance metrics dashboard
fix(api): resolve memory leak in model loading
docs: update Docker Offload setup instructions
test: add integration tests for code completion
```

## 🏷️ Labeling System

### Issue Labels

- **Type**: `bug`, `enhancement`, `documentation`, `question`
- **Priority**: `high`, `medium`, `low`
- **Component**: `frontend`, `backend`, `docker`, `docs`
- **Status**: `help-wanted`, `good-first-issue`, `blocked`
- **Size**: `small`, `medium`, `large`

### Pull Request Labels

- **Status**: `work-in-progress`, `ready-for-review`, `needs-changes`
- **Type**: `breaking-change`, `feature`, `bugfix`, `documentation`
- **Size**: `small`, `medium`, `large`

## 🌟 Recognition

Contributors will be:

- **Listed** in the project README
- **Mentioned** in release notes
- **Invited** to join the contributors team
- **Featured** in project documentation

## 📞 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Documentation**: Check docs/ directory first
- **Email**: Contact [@ajeetraina](https://github.com/ajeetraina) for urgent matters

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you agree to uphold this code.

### Communication Guidelines

- Be **respectful** and **inclusive**
- **Search existing discussions** before asking questions
- Provide **context** and **details** in issues
- Use **clear, descriptive titles**
- **Tag relevant people** when needed

## 📚 Resources

### Documentation

- [Setup Guide](docs/SETUP.md)
- [Decision Guide](docs/decision-guide.md)
- [Performance Benchmarks](docs/benchmarks.md)

### External Resources

- [Docker Offload Documentation](https://docs.docker.com/offload/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🙏 Thank You

Your contributions make this project better for everyone. Whether you're fixing a typo, adding a feature, or improving documentation, every contribution is valuable and appreciated!

---

**Questions?** Don't hesitate to ask! Create an issue or reach out to the maintainers.

**Ready to contribute?** Fork the repo and dive in! 🚀