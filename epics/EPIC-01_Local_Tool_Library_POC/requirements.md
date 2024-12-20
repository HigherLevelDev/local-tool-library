# Local Tool Library POC

## Description
A simple web application that enables neighbors to share tools within their community. Users can register tools they're willing to share and search for tools they need to borrow. The platform provides basic tool discovery and location information while keeping personal information private.

## Goals
- Create a basic platform for neighborhood tool sharing
- Enable simple tool registration with automated image finding
- Provide basic search functionality
- Show approximate tool locations on a map
- Deliver a functional API with basic documentation

## Success Criteria
- Users can register with email, phone, and postcode
- Users can add tools with automated image assignment
- Users can search for tools by title/description
- Tool locations are displayed on a map
- API is documented with Swagger
- Basic authentication is implemented and secure

## Technical Requirements

### Authentication
- Simple OAuth 2.0 implementation with password grant
- Basic token management
- Login/logout functionality

### API Requirements
- RESTful API design
- Basic Swagger documentation
- Standard error responses

### User Management
- User registration with:
  * Email
  * Phone number
  * Postcode
  * Password
- Basic profile viewing

### Tool Management
- Tool registration with:
  * Title
  * Description
  * Automated image URL (based on title)
  * Location (from owner's postcode)
- Basic tool editing and deletion

### Search & Discovery
- Simple text search on tool title and description
- Basic results display
- Mobile-responsive results page

### Location Services
- Basic postcode to coordinate conversion
- Simple map display of tool location
- Approximate location display for privacy

### Image Management
- Basic web image search integration
- Simple fallback image for failed searches

### Non-Functional Requirements

#### Security
- HTTPS encryption
- Basic input validation
- Secure password storage

#### Browser Support
- Support for modern browsers
- Mobile-responsive design

## Out of Scope
- API versioning
- Rate limiting
- Password reset
- Advanced search filters
- Image optimization
- Performance monitoring
- User ratings
- In-app messaging
- Payment processing
- Tool delivery logistics
- Phone verification
- Social media integration