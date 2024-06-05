const { PrismaClient } = require('@prisma/client');
const express = require('express');
const path = require('path');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes pour servir les pages HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/restaurants', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'restaurants.html'));
});

app.get('/employees', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'employees.html'));
});

// Routes CRUD pour Restaurant
app.get('/api/restaurants', async (req, res) => {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
});

app.get('/api/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(id) } });
    res.json(restaurant);
});

app.post('/api/restaurants', async (req, res) => {
    const { name, location } = req.body;
    const newRestaurant = await prisma.restaurant.create({
        data: { name, location },
    });
    res.json(newRestaurant);
});

app.put('/api/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;
    const updatedRestaurant = await prisma.restaurant.update({
        where: { id: Number(id) },
        data: { name, location },
    });
    res.json(updatedRestaurant);
});

app.delete('/api/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.restaurant.delete({ where: { id: Number(id) } });
    res.json({ message: 'Restaurant deleted' });
});

// Routes CRUD pour Employee
app.get('/api/employees', async (req, res) => {
    const employees = await prisma.employee.findMany({
        include: { restaurant: true },  // Inclure les informations du restaurant
    });
    res.json(employees);
});

app.get('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({ 
        where: { id: Number(id) },
        include: { restaurant: true }  // Inclure les informations du restaurant
    });
    res.json(employee);
});

app.post('/api/employees', async (req, res) => {
    const { name, email, active, restaurantId } = req.body;
    const newEmployee = await prisma.employee.create({
        data: { name, email, active, restaurantId: Number(restaurantId) },
    });
    res.json(newEmployee);
});

app.put('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, active, restaurantId } = req.body;
    const updatedEmployee = await prisma.employee.update({
        where: { id: Number(id) },
        data: { name, email, active, restaurantId: Number(restaurantId) },
    });
    res.json(updatedEmployee);
});

app.delete('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id: Number(id) } });
    res.json({ message: 'Employee deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
