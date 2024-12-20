# Example Project

## Project Overview
- **Purpose**: Demonstrate the new documentation structure and standards
- **Key Features**:
  - Documentation templates
  - Project organization
  - Development standards
- **Target Users**: Development teams using the MCP framework
- **Business Value**: Improved project maintainability and knowledge sharing

## Quick Start
```bash
# Clone the repository
git clone https://github.com/alistairwalsh/mcp_projects.git
cd mcp_projects

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development environment
docker-compose up -d
```

## Documentation Structure
```
./cline_docs/
├── global/                 # Global configuration and standards
│   ├── STANDARDS.md       # Development and documentation standards
│   └── ENVIRONMENT.md     # Environment setup and configuration
└── example-project/       # Project-specific documentation
    ├── README.md         # This file - project overview
    ├── ARCHITECTURE.md   # Technical design & decisions
    ├── TODO.md          # Task tracking
    └── CHANGELOG.md     # Version history
```

## Key Links
- [Architecture Documentation](./ARCHITECTURE.md)
- [Task List](./TODO.md)
- [Change History](./CHANGELOG.md)
- [Global Standards](../global/STANDARDS.md)
- [Environment Setup](../global/ENVIRONMENT.md)

## Contributing
1. Follow the [Global Standards](../global/STANDARDS.md)
2. Set up your environment according to [Environment Setup](../global/ENVIRONMENT.md)
3. Create a feature branch from `main`
4. Submit a pull request with updated documentation

## Support
- GitHub Issues: [Project Issues](https://github.com/alistairwalsh/mcp_projects/issues)
- Documentation: [Project Wiki](https://github.com/alistairwalsh/mcp_projects/wiki)

Last Updated: 2024-03-19
Updated By: Claude
