import { NextFunction, Request, Response } from "express";
import Client from './../models/Client';

// Create a new user
export const createUser = (req: Request, res: Response) => {
  const newUser = new Client(req.body);
  const { name, cpf, email } = req.body
  console.log(newUser);
  console.log(name, cpf)
  newUser.save()
    .then((user: any) => {
      res.json(user);
    })
    .catch((err: Error) => {
      res.status(500).send(err);
    });
};

// Get all users
export const getUsers = (req: Request, res: Response) => {
  Client.find()
    .then((users: any) => {
      res.json(users);
    })
    .catch((err: Error) => {
      res.status(500).send(err);
    });
};

// Get a single user by id
export const getUser = (req: Request, res: Response) => {
  Client.findById(req.params.id)
    .then((user: any) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch((err: Error) => {
    //   if (err.kind === 'ObjectId') {
    //     return res.status(404).send({ message: 'User not found' });
    //   }
      return res.status(500).send({ message: 'Error retrieving user' });
    });
};

// Update a user
export const updateUser = (req: Request, res: Response) => {
  Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user: any) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch((err: Error) => {
    //   if (err.kind === 'ObjectId') {
    //     return res.status(404).send({ message: 'User not found' });
    //   }
      return res.status(500).send({ message: 'Error updating user' });
    });
};

// Delete a user
export const deleteUser = (req: Request, res: Response) => {
  Client.findByIdAndRemove(req.params.id)
    .then((user: any) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully!' });
    })
    .catch((err: Error) => {
        // if (err.kind === 'ObjectId') {
        //   return res.status(404).send({ message: 'User not found' });
        // }
        return res.status(500).send({ message: 'Error updating user' });
      });
  };

  module.exports = { createUser, getUsers, updateUser, deleteUser, getUser }