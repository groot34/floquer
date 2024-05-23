import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors())
const PORT = 5000;


// Set up __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diraname = path.resolve();
console.log(diraname)
console.log(__dirname)
console.log(__filename)


// Function to aggregate data
const aggregateData = (data) => {
    const aggregated = {};

    data.forEach((row) => {
        const year = row.work_year;
        const salary = parseFloat(row.salary_in_usd);

        if (!isNaN(salary)) {
            if (!aggregated[year]) {
                aggregated[year] = { totalJobs: 0, totalSalary: 0 };
            }

            aggregated[year].totalJobs += 1;
            aggregated[year].totalSalary += salary;
        }
    });

    console.log(aggregated);

    const result = Object.keys(aggregated).map((year) => ({
        year: parseInt(year),
        totalJobs: aggregated[year].totalJobs,
        averageSalary: aggregated[year].totalSalary / aggregated[year].totalJobs,
    }));

    return result;
};

// API endpoint to fetch aggregated data
app.get('/salaries', (req, res) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'data', 'salaries.csv'))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const aggregatedData = aggregateData(results);
            res.set('Cache-Control', 'no-store');
            res.json(aggregatedData);
        });
});

app.get('/job-titles/:year', (req, res) => {
    const year = req.params.year;
    const results = [];
    fs.createReadStream(path.join(__dirname, 'data', 'salaries.csv'))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const filteredData = results.filter((row) => row.work_year === year);
            const titles = {};
            filteredData.forEach((row) => {
                const title = row.job_title;
                if (!titles[title]) {
                    titles[title] = 0;
                }
                titles[title] += 1;
            });
            const response = Object.keys(titles).map((title) => ({
                title,
                count: titles[title],
            }));
            res.json(response);
        });
});
     


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


