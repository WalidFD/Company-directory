var companies = [];
var allCompanies = [];
var currentCompanyIndex = null;
var databaseURL = "https://company-directory-ed369-default-rtdb.asia-southeast1.firebasedatabase.app";

function loadCompanies() {
    fetch(databaseURL + "/companies.json")
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data) {
                companies = Object.values(data);
                allCompanies = Object.values(data);
            } else {
                companies = [];
                allCompanies = [];
            }
            updateDropdown(companies);
        })
        .catch(function(error) {
            console.error("Error loading companies:", error);
        });
}

function updateDropdown(list) {
    var select = document.getElementById('companySelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choose Company --</option>';
    list.forEach(function(c, i) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.textContent = c.name;
        select.appendChild(opt);
    });
}

// FIXED SEARCH BAR
var searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        var term = this.value.toLowerCase().trim();

        if (term === '') {
            // Show all companies if search is empty
            companies = allCompanies;
        } else {
            // Filter companies based on search term
            companies = allCompanies.filter(function(c) {
                return c.name.toLowerCase().includes(term) || 
                       c.personName.toLowerCase().includes(term) ||
                       c.phone.toLowerCase().includes(term) ||
                       c.designation.toLowerCase().includes(term);
            });
        }

        updateDropdown(companies);
        document.getElementById('companyInfo').innerHTML = '<p class="placeholder">Select a company</p>';
        document.getElementById('actionButtons').style.display = 'none';
    });
}

var companySelect = document.getElementById('companySelect');
if (companySelect) {
    companySelect.addEventListener('change', function() {
        if (!this.value) {
            document.getElementById('companyInfo').innerHTML = '<p class="placeholder">Select a company</p>';
            document.getElementById('actionButtons').style.display = 'none';
            return;
        }
        currentCompanyIndex = parseInt(this.value);
        var c = companies[currentCompanyIndex];
        document.getElementById('companyInfo').innerHTML = '<h3>' + c.name + '</h3><p><strong>Contact:</strong> ' + c.personName + '</p><p><strong>Designation:</strong> ' + c.designation + '</p><p><strong>Phone:</strong> ' + c.phone + '</p><p><strong>Website:</strong> <a href="' + c.website + '" target="_blank">' + c.website + '</a></p><p><strong>Address:</strong> ' + c.address + '</p>';
        document.getElementById('actionButtons').style.display = 'flex';
    });
}

function exportPDF() {
    if (currentCompanyIndex === null) { alert('Select a company'); return; }
    var c = companies[currentCompanyIndex];
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Company Details', 20, 20);
    doc.setFontSize(12);
    var y = 40;
    doc.text('Company: ' + c.name, 20, y); y += 10;
    doc.text('Contact: ' + c.personName, 20, y); y += 10;
    doc.text('Designation: ' + c.designation, 20, y); y += 10;
    doc.text('Phone: ' + c.phone, 20, y); y += 10;
    doc.text('Website: ' + c.website, 20, y); y += 10;
    doc.text('Address: ' + c.address, 20, y);
    doc.save(c.name + '.pdf');
}

function downloadAllCSV() {
    if (allCompanies.length === 0) { alert('No companies'); return; }
    var csv = 'Company Name,Contact Person,Designation,Phone,Website,Address\n';
    allCompanies.forEach(function(c) {
        csv += '"' + c.name + '","' + c.personName + '","' + c.designation + '","' + c.phone + '","' + c.website + '","' + c.address + '"\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'companies_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function deleteCompany() {
    if (currentCompanyIndex === null) { alert('Select a company'); return; }
    var companyName = companies[currentCompanyIndex].name;
    if (confirm('Delete "' + companyName + '"?')) {
        fetch(databaseURL + "/companies.json")
            .then(function(response) { return response.json(); })
            .then(function(data) {
                var keys = Object.keys(data);
                var keyToDelete = keys[currentCompanyIndex];
                if (keyToDelete) {
                    return fetch(databaseURL + "/companies/" + keyToDelete + ".json", {
                        method: "DELETE"
                    });
                }
            })
            .then(function() {
                alert('Company deleted!');
                loadCompanies();
            })
            .catch(function(error) {
                alert('Error: ' + error.message);
            });
    }
}

document.addEventListener('DOMContentLoaded', loadCompanies);

// Refresh every 10 seconds to sync data
setInterval(loadCompanies, 10000);
