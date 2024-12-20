# Local Tool Library POC

## Description
A web and mobile-web application that enables neighbors to share tools within their community. The platform facilitates tool discovery and sharing while keeping personal information private and communications off-platform. The system will provide a seamless experience for both tool owners and borrowers with an emphasis on easy tool registration, discovery, and location-based searching.

## Goals
- Create a user-friendly platform for neighborhood tool sharing
- Enable easy tool registration with automated image enhancement
- Provide efficient search and discovery mechanisms
- Maintain user privacy while enabling tool location visibility
- Deliver a production-ready API with complete documentation

## Success Criteria
- Users can successfully register with email, phone, and postcode
- Tool owners can add tools with automated image assignment
- Users can search and find tools based on title and description
- Tool locations are displayed appropriately on a map
- API is fully documented with Swagger/OpenAPI
- Authentication system is implemented and secure

## Technical Requirements

### Authentication & Authorization
- OAuth 2.0 implementation with password grant flow
- Secure token management and refresh mechanisms
- Role-based access control (tool owner vs borrower)

### API Requirements
- RESTful API design
- OpenAPI/Swagger documentation
- API versioning support
- Proper error handling and status codes
- Rate limiting implementation

### User Management
- User registration with email, phone, and postcode
- Profile management capabilities
- No phone verification required
- Password reset functionality
- User deletion capability

### Tool Management
- Tool registration with:
  * Title
  * Description
  * Automated image URL generation based on title
  * Location (derived from owner's postcode)
- Tool editing and deletion capabilities
- Tool availability status management

### Search & Discovery
- Full-text search on tool title and description
- Location-based search capabilities
- Search result pagination
- Filter and sort options
- Responsive search results UI

### Location Services
- Postcode to coordinate conversion
- Map integration for tool location display
- Privacy-conscious location display (approximate location only)
- Map clustering for areas with multiple tools

### Image Management
- Integration with web-based image search API
- Image caching and optimization
- Fallback images for failed searches
- Image moderation capabilities

### Non-Functional Requirements

#### Performance
- Search results returned within 500ms
- Page load time under 2 seconds
- Support for 1000+ concurrent users
- 99.9% uptime SLA

#### Security
- HTTPS encryption
- Input validation and sanitization
- XSS and CSRF protection
- SQL injection prevention
- Rate limiting on API endpoints
- Secure password storage (bcrypt/argon2)

#### Scalability
- Horizontal scaling capability
- Caching strategy for frequently accessed data
- Database indexing for efficient searches
- CDN integration for static assets

#### Monitoring & Logging
- API usage metrics
- Error tracking and reporting
- Performance monitoring
- User activity logging
- Security event logging

#### Browser Support
- Support for latest 2 versions of major browsers
- Mobile-responsive design
- Progressive Web App capabilities

## Out of Scope
- In-app messaging system
- Payment processing
- Tool delivery logistics
- User ratings/reviews
- Phone number verification
- Social media integration