var databaseURL = "https://company-directory-ed369-default-rtdb.asia-southeast1.firebasedatabase.app";

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('companyForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var companyName = document.getElementById('companyName').value.trim();
        var personName = document.getElementById('personName').value.trim();
        var designation = document.getElementById('designation').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var website = document.getElementById('website').value.trim();
        var address = document.getElementById('address').value.trim();

        if (!companyName || !personName || !designation || !phone || !website || !address) {
            alert("All fields are required!");
            return;
        }

        try {
            new URL(website);
        } catch {
            alert("Invalid website URL");
            return;
        }

        var newCompany = {
            name: companyName,
            personName: personName,
            designation: designation,
            phone: phone,
            website: website,
            address: address
        };

        // Read existing companies
        fetch(databaseURL + "/companies.json")
            .then(function(response) { return response.json(); })
            .then(function(data) {
                var companies = data ? Object.values(data) : [];

                // Check duplicate
                var duplicate = companies.find(function(c) {
                    return c.name.toLowerCase() === companyName.toLowerCase();
                });

                if (duplicate) {
                    alert("Company already exists!");
                    return;
                }

                companies.push(newCompany);

                var companiesObj = {};
                companies.forEach(function(c, idx) {
                    companiesObj[idx] = c;
                });

                // Save to Firebase
                return fetch(databaseURL + "/companies.json", {
                    method: "PUT",
                    body: JSON.stringify(companiesObj)
                });
            })
            .then(function(response) {
                if (!response.ok) throw new Error("Save failed");
                alert("✅ Company saved!");
                document.getElementById('companyForm').reset();
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 500);
            })
            .catch(function(error) {
                alert("Error: " + error.message);
                console.error(error);
            });
    });
});