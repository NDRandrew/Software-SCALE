# SCALE - Software for CALculating Emergy based on Life Cycle Inventories

**SCALE** is a web-based tool developed using Python, Flask, and Pandas to calculate emergy based on life cycle inventories (LCIs). The application allows users to upload life cycle inventory (LCI) data, process it to calculate emergy, and visualize the results through interactive graphs.

---

## Features

- **User-friendly web interface**: Built with Flask, providing an easy-to-navigate web page where users can upload their LCI data.
- **Emergy Calculation**: Automatically calculates emergy based on inputted LCI data.
- **Data Processing**: Efficient handling and processing of large datasets using Pandas.
- **Interactive Visualizations**: Graphs and charts for a clear representation of emergy calculations and analysis.
- **File Upload**: Users can upload their LCI data in CSV format for processing.

---

## Installation

Follow the steps below to set up **SCALE** on your local machine:

### Prerequisites

Make sure you have the following installed:

- Python 3.8 or later
- pip (Python's package installer)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/SCALE.git
    cd SCALE
    ```

2. Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the Flask application:
    ```bash
    python app.py
    ```

5. Open a web browser and navigate to:
    ```
    http://127.0.0.1:5000/
    ```

---

## Usage

Once the application is running, follow these steps:

1. **Upload your LCI Data**: 
    - On the homepage, click the "Upload CSV" button to upload your LCI data file. The file must be in CSV format, and it should contain relevant life cycle inventory data.

2. **Process the Data**:
    - After uploading the file, the application will automatically process the data to calculate the emergy.

3. **View the Results**:
    - Once the calculations are complete, the emergy results will be displayed as graphs and charts. These visualizations will help you analyze and interpret the emergy of different life cycle processes.

---

## Project Structure

---


---

## Dependencies

- **Flask**: Web framework for Python to serve the web pages.
- **Pandas**: Data manipulation and analysis library for processing LCI data.
- **Matplotlib**: Plotting library for visualizing emergy results.
- **NumPy**: Library for numerical operations.
- **Flask-WTF**: Flask extension for handling forms and file uploads.

These dependencies are listed in `requirements.txt`.

---

## Contributing

We welcome contributions to enhance the functionality and features of **SCALE**. If you would like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Thanks to the open-source community for the tools and libraries that make this project possible!
- Special thanks to contributors for helping to make **SCALE** better!

