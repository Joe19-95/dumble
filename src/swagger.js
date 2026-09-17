module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'Dumble API',
        version: '1.0.0',
        description: 'API documentation for Dumble'
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
        { name: 'Auth' },
        { name: 'Profile' },
        { name: 'Requests' },
        { name: 'Connections' },
        { name: 'Users' }
    ],
    components: {
        securitySchemes: {
            cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66f1c23b8d9a1a0012345678' },
                    fname: { type: 'string', example: 'Joe' },
                    lname: { type: 'string', example: 'Thomas' },
                    email: { type: 'string', format: 'email', example: 'joe@example.com' },
                    photoURL: { type: 'string', example: 'https://example.com/photo.jpg' },
                    age: { type: 'integer', minimum: 5, maximum: 90, example: 25 },
                    gender: { type: 'string', enum: ['M', 'F', 'O'] },
                    skills: { type: 'array', items: { type: 'string' }, example: ['JavaScript', 'Node.js'] }
                }
            },
            SignUp: {
                type: 'object',
                required: ['fname', 'lname', 'email', 'password'],
                properties: {
                    fname: { type: 'string', minLength: 2, maxLength: 10 },
                    lname: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' },
                    photoURL: { type: 'string' },
                    age: { type: 'integer', minimum: 5, maximum: 90 },
                    gender: { type: 'string', enum: ['M', 'F', 'O'] },
                    skills: { type: 'array', items: { type: 'string' } }
                }
            },
            Connection: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    from: { oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/User' }] },
                    to: { oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/User' }] },
                    status: { type: 'string', enum: ['ignored', 'rejected', 'accepted', 'interested'] }
                }
            }
        }
    },
    paths: {
        '/signUp': {
            post: {
                tags: ['Auth'],
                summary: 'Create an account',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SignUp' } } }
                },
                responses: {
                    200: { description: 'User created' },
                    500: { description: 'Invalid input or server error' }
                }
            }
        },
        '/login': {
            post: {
                tags: ['Auth'],
                summary: 'Log in and set the authentication cookie',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Logged in', headers: { 'Set-Cookie': { schema: { type: 'string' } } } },
                    500: { description: 'Invalid credentials' }
                }
            }
        },
        '/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Log out',
                responses: { 200: { description: 'Logged out' } }
            }
        },
        '/passwordUpdate': {
            patch: {
                tags: ['Auth'],
                summary: 'Change the current user password',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['oldPass', 'newPass'],
                                properties: {
                                    oldPass: { type: 'string', format: 'password' },
                                    newPass: { type: 'string', format: 'password' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Password updated' }, 500: { description: 'Update failed' } }
            }
        },
        '/profile/view': {
            get: {
                tags: ['Profile'],
                summary: 'Get the current profile',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: 'Current user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    400: { description: 'Not authenticated' }
                }
            }
        },
        '/profile/edit': {
            patch: {
                tags: ['Profile'],
                summary: 'Edit the current profile',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    photoURL: { type: 'string' },
                                    age: { type: 'integer', minimum: 5, maximum: 90 },
                                    gender: { type: 'string', enum: ['M', 'F', 'O'] },
                                    skills: { type: 'array', items: { type: 'string' } }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Profile updated' }, 500: { description: 'Update failed' } }
            }
        },
        '/feed': {
            get: {
                tags: ['Users'],
                summary: 'Get the user feed',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: {
                        description: 'Users',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } }
                    },
                    400: { description: 'Not authenticated' }
                }
            }
        },
        '/delUser': {
            delete: {
                tags: ['Users'],
                summary: 'Delete a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['userId'], properties: { userId: { type: 'string' } } }
                        }
                    }
                },
                responses: { 200: { description: 'User deleted' }, 400: { description: 'User not found' } }
            }
        },
        '/updateUser': {
            patch: {
                tags: ['Users'],
                summary: 'Update a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['userId'],
                                properties: {
                                    userId: { type: 'string' },
                                    age: { type: 'integer', minimum: 5, maximum: 90 },
                                    skills: { type: 'array', items: { type: 'string' } }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'User updated' }, 500: { description: 'Update failed' } }
            }
        },
        '/sendRequest/{status}/{toId}': {
            post: {
                tags: ['Requests'],
                summary: 'Send a connection request',
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: 'status', in: 'path', required: true, schema: { type: 'string', enum: ['interested', 'ignored'] } },
                    { name: 'toId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Request sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/Connection' } } } },
                    400: { description: 'Invalid request' }
                }
            }
        },
        '/reviewRequest/{status}/{connectionReq}': {
            post: {
                tags: ['Requests'],
                summary: 'Accept or reject a connection request',
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: 'status', in: 'path', required: true, schema: { type: 'string', enum: ['accepted', 'rejected'] } },
                    { name: 'connectionReq', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: { 200: { description: 'Request reviewed' }, 400: { description: 'Invalid request' } }
            }
        },
        '/view/requests': {
            get: {
                tags: ['Connections'],
                summary: 'View received connection requests',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: {
                        description: 'Received requests',
                        content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Connection' } } } } } }
                    },
                    400: { description: 'Request failed' }
                }
            }
        },
        '/view/connections': {
            get: {
                tags: ['Connections'],
                summary: 'View accepted connections',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: {
                        description: 'Connected users',
                        content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } }
                    },
                    400: { description: 'Request failed' }
                }
            }
        }
    }
}
