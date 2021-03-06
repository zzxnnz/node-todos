const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = "test something";

        request(app)
            .post("/todos")
            .set("x-auth", users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                   return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it("should not create todo with invalid body data", (done) => {
        request(app)
            .post("/todos")
            .set("x-auth", users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().
                then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                })
                .catch((err) => done(err));
            });
    })
});


describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return todo document", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text);

            })
            .end(done);
    });

    it("should not return todo document created by other user", (done) => {
        request(app)
            .get(`/todos/${todos[2]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        // make sure you get 404 back
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 for non-object ids", (done) => {
        // todos/123
        request(app)
            .get("/todos/123")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("should remove a todo", (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo).toBeFalsy();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it("should not remove a todo created by other user", (done) => {
        var hexId = todos[2]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo).toBeTruthy();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it("should return 404 if todo not found", (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 if object id is invalid", (done) => {
        request(app)
            .delete("/todos/123")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    describe("PATCH /todos/:id", () => {
        it("should update the todo", (done) => {
            var hexId = todos[0]._id.toHexString();
            var text = "asd";
            request(app)
                .patch(`/todos/${hexId}`)
                .set("x-auth", users[0].tokens[0].token)
                .send({completed: true, text})
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    // expect(res.body.todo.completedAt).toBeA("number");
                    expect(typeof res.body.todo.completedAt).toBe("number");
                })
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should not update the todo created by other user", (done) => {
            var hexId = todos[0]._id.toHexString();
            var text = "asd";
            request(app)
                .patch(`/todos/${hexId}`)
                .set("x-auth", users[1].tokens[0].token)
                .send({completed: true, text})
                .expect(404)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should clear completedAt when todo is not completed", (done) => {
            var text = "asd";
            var hexId = todos[1]._id.toHexString();
            request(app)
                .patch(`/todos/${hexId}`)
                .set("x-auth", users[0].tokens[0].token)
                .send({completed: false, text})
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toBeFalsy();
                })
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    done();
                });
        });
    });
});


describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end((err) => {
                if(err) {
                    done(err);
                } else {
                    done();
                }
            })
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end((err) => {
                if(err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});

describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "18301923123";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => {
                    done(err);
                });
            })
    });

    it("should return validaton errors if request invalid", (done) => {
        var email = "exampleexample.com";
        var password = "";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors).toBeTruthy();
            })
            .end(() => {
                done();
            });
    });

    it("should not create user if email in use", (done) => {
        var email = "example@example.com";
        var password = "18301923123";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errmsg).toBeTruthy();
            })
            .end(() => {
                done();
            });
    });
});


describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
            .post("/users/login")
            .send({email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });
                }).catch((err) => {
                    done(err);
                });
                done();
            });
    });

    it("should reject invalid login", (done) => {
        request(app)
            .post("/users/login")
            .send({email: users[1].email, password: "1234"})
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeFalsy();
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                }).catch((err) => {
                    done(err);
                });

                done();
            });
    });
});


describe("DELETE /users/me/token", () => {
    it("should remove auth token on logout", (done) => {
        request(app)
            .delete("/users/me/token")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});