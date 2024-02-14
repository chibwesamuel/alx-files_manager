//AppController.js
class AppController {
  static getHome(req, res) {
    res.status(200).json({ message: 'Welcome to the API' });
  }

  static addNewItem(req, res) {
    // Assuming a JSON request with data like { "name": "Item Name", "description": "Item Description" }
    const { name, description } = req.body;

    // Process the data and add it to your application logic/database
    // Example: Saving to a database
    // SomeDatabaseModel.create({ name, description })
    //   .then((item) => {
    //     res.status(201).json(item);
    //   })
    //   .catch((error) => {
    //     res.status(500).json({ error: 'Failed to add item' });
    //   });

    // For simplicity, we'll just echo back the received data
    res.status(201).json({ name, description });
  }
}

export default AppController;
