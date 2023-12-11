let resourcesMasses = {};
fetch('/get-resources-masses')
    .then(response => response.json())
    .then(data => {
        resourcesMasses = data;
    })
.catch(error => console.error('Error fetching resource masses:', error));

$(document).ready(function(){
    let moduleNames = [];

    $("#saveBuildButton").click(saveBuild);
    $('#mainTable tbody tr').each(function() {
        var selectDropdown = $(this).find('.module-dropdown');
        if (selectDropdown.length) {
            selectDropdown.select2();
        }
    });

    // Fetch module names on page load
    async function fetchModuleNames() {
        const response = await fetch('/get-module-names');
        moduleNames = await response.json();
    }

    fetchModuleNames();

    $("#addRow").click(function(e){
        e.preventDefault();
    
        var newRowID = $("#mainTable tbody tr").length + 1;
        var dropdownOptions = moduleNames.map(name => `<option value="${name}">${name}</option>`).join("");
    
        var newRow = '<tr>' +
                        '<td>' + newRowID + '</td>' +
                        '<td><select class="module-dropdown">' + dropdownOptions + '</select></td>' +
                        '<td><input type="number" value="1" min="1" class="count-input"></td>' +
                        '<td><button class="removeRow">Remove</button></td>' +  // Add this line for the remove button
                     '</tr>';
    
        $("#mainTable tbody").append(newRow);

        // Initialize Select2 on the newly added dropdown
        $("#mainTable tbody .module-dropdown").select2();

        recalculateSummary();
    });

    $(document).on('click', '.removeRow', function() {
        $(this).closest('tr').remove();
        recalculateSummary();
    });

    $(document).on('input', '.count-input', function() {
        let value = parseFloat($(this).val());
        if (value < 1) {
            alert('Value cannot be less than 1');
            $(this).val(1);  // Reset to 1
        }
    });

    $(document).on('change', '.module-dropdown, .count-input', recalculateSummary);

    async function recalculateSummary() {
        var resourcesSummary = {}; // {resourceName: {amount: x, mass: y}, ...}
        var totalMass = 0;

        await Promise.all($("#mainTable tbody tr").map(async function() {
            var moduleName = $(this).find('.module-dropdown').val();
            var count = parseFloat($(this).find('.count-input').val());

            const response = await fetch(`/get-module-resources/${moduleName}`);
            const data = await response.json();

            for (let resource in data.resources) {
                let resourceData = data.resources[resource];
                let amount = resourceData.amount * count;
                let mass = resourceData.mass * count;

                if (!resourcesSummary[resource]) {
                    resourcesSummary[resource] = { amount: 0, mass: 0 };
                }

                resourcesSummary[resource].amount += amount;
                resourcesSummary[resource].mass += mass;
                //totalMass += mass;
            }
        }).get());

        /** ********************************* **/
        // Populate the summary table
        let summaryTableBody = $("#summaryTable tbody");
        summaryTableBody.empty();

        for (let [resource, details] of Object.entries(resourcesSummary)) {
            let existingRow = summaryTableBody.find(`tr[data-resource='${resource}']`);
            let resourceTotalMass = 0;

            if (resourcesMasses[resource]) {
                const resourceMass = resourcesMasses[resource];
                resourceTotalMass = details.amount * resourceMass;
                totalMass += resourceTotalMass;
            } else {
                resourceTotalMass = 0;
                console.error(`Resource ${resource} not found in cached masses!`);
            }

            if (existingRow.length) {
                // Update the existing row
                existingRow.find("td").eq(1).text(details.amount); // Update amount
                existingRow.find("td").eq(2).text(resourceTotalMass.toFixed(1));   // Update mass
            } else {
                //for (let resource in resourcesSummary) {
                let row = `<tr data-resource="${resource}">
                            <td class="resource-row">${resource}</td>
                            <td class="resource-row">${resourcesSummary[resource].amount}</td>
                            <td class="resource-row">${resourceTotalMass.toFixed(1)}</td>
                        </tr>`;
                summaryTableBody.append(row);
            }
        }
        /** ********************************** **/

        // Update the total mass in the footer
        $("#totalMassValue").text(totalMass.toFixed(1));

        //updateResourceMasses();
    }

    async function saveBuild() {
        // The code for generating a URL instead of saving to DB
        let buildData = gatherBuildData();
        let encodedData = btoa(JSON.stringify(buildData)); // Encode the build data to a base64 string
        let generatedURL = window.location.origin + "/display-build?build=" + encodedData;
        let buildUrlAnchor = document.querySelector('#build-url');
        buildUrlAnchor.href = generatedURL;
        buildUrlAnchor.textContent = "Click here for the build: " + generatedURL;
        document.querySelector('#build-url-display').style.display = 'block';
        //alert("Here's your generated URL: " + generatedURL);
        window.location.href = window.location.origin + "/display-build?build=" + encodedData;
    }
    
    function gatherBuildData() {
        // Validate if there are rows in the main table
        if ($("#mainTable tbody tr").length === 0) {
            alert("Please add at least one module to save the build.");
            return; // Exit the function
        }
        
        // Validate if the build name is provided
        let buildName = $('#buildName').val().trim();
        if (buildName === "") {
            alert("Please provide a build name.");
            return; // Exit the function
        }

        // Collect all modules and their counts from the main table
        let modules = [];
        $("#mainTable tbody tr").each(function() {
            let moduleName = $(this).find(".module-dropdown").val();
            let count = parseFloat($(this).find(".count-input").val());
            modules.push({ name: moduleName, count: count });
        });
    
        // Collect summarized data
        let summarizedResources = [];
        $("#summaryTable tbody tr").each(function() {
            let resourceName = $(this).find("td").eq(0).text(); // Get the name of the resource from the first cell
            let amount = parseFloat($(this).find("td").eq(1).text()); // Get the amount from the second cell
            let mass = parseFloat($(this).find("td").eq(2).text()); // Get the mass from the third cell
            summarizedResources.push({ resource: resourceName, amount: amount, mass: mass });
        });
    
        let totalMass = parseFloat($("#totalMassValue").text());
    
        return {
            buildName: buildName,
            modules: modules,
            summarizedResources: summarizedResources,
            totalMass: totalMass,
            timestamp: new Date()
        }
    }

    $('.collected-input').on('input', function() {
        var totalAmount = parseInt($(this).attr('max'), 10);
        var collectedAmount = parseInt($(this).val(), 10) || 0; // Ensure it falls back to 0 if empty
        var remainingAmount = totalAmount - collectedAmount;
        
        var $remainingSpan = $(this).nextAll('.remaining').first(); // get the corresponding .remaining span
        $remainingSpan.text(' (' + remainingAmount + ' remaining)');
        
        if (remainingAmount === 0) {
            $remainingSpan.css('color', 'green');
        } else {
            $remainingSpan.css('color', ''); // Resets to the default color if it's not 0
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    $(".module-dropdown").select2({
        minimumResultsForSearch: 0
    });
    $("table tbody tr:last .module-dropdown").select2({
        minimumResultsForSearch: 0
    });
    $(".module-dropdown:not(.select2-hidden-accessible)").select2({
        minimumResultsForSearch: 0
    });
});