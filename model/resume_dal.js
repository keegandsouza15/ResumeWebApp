/**
 * Created by keegan on 11/16/16.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_name_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * FROM resume_name_view WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?,?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.resume_name,params.account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

}


exports.insert1 = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?,?)';
    var queryData = [params.resume_name, params.account_id];
    connection.query(query, queryData, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var resume_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';


        // TO BULK INSERT AN ARRAY OF VALUES WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resume_skillData = [];
        // if only one value is submitted, JavaScript will treat the value as an array, so we skip it if its not an array
        // for example if the value of params.address_id was "10", it would loop over the "1" and then the "0", instead of
        // treating it as one value.
        if(params.skill_id instanceof Array) {
            for(var i=0; i < params.skill_id.length; i++) {
                resume_skillData.push([resume_id, params.skill_id[i]]);
            }
        }
        else {
            resume_skillData.push([resume_id, params.skill_id]);
        }
       // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [resume_skillData], function(err, result){
            callback(err, result);
        });

        var query_c = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
        var resume_companyData = [];
        if(params.company_id instanceof Array){
            for (var i = 0; i < params.company_id.length; i++){
                resume_companyData.push([resume_id,params.company_id[i]]);
            }
        }
        else{
            resume_companyData.push([resume_id,params.company_id]);
        }
        // Resume Company
        connection.query(query_c, [resume_companyData], function (err, result) {
            //callback(err, result);
        })

        var query_s = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';
        var resume_schoolData = [];
        if(params.school_id instanceof Array){
            for (var i = 0; i < params.school_id.length; i++){
                resume_schoolData.push([resume_id,params.school_id[i]]);
            }
        }
        else{
            resume_schoolData.push([resume_id,params.school_id]);
        }
        // Resume School
        connection.query(query_s, [resume_schoolData], function (err, result) {
            //callback(err, result);
        })


    });

};
exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
}

//declare the function so it can be used locally
var resumeInsert = function(resume_id, accountIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume (resume_id, account_id) VALUES ? , ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeData = [];
    for(var i=0; i < accountIdArray.length; i++) {
        resumeData.push([resume_id, accountIdArray[i]]);
    }
    connection.query(query, [resumeData[i]], [resumeData[i]], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeInsert = resumeInsert;

//declare the function so it can be used locally
var resumeDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeDeleteAll = resumeDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ?, account_id = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.account_id, params.resume_id];
 /*   connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
       resumeDeleteAll(params.resume_id, function(err, result){

          if(params.account_id != null) {
                //insert company_address ids
               resumeInsert(params.resume_id, params.account_id, function(err, result){
                    callback(err, result);
               });}
            else {
                callback(err, result);
            }
        });

    });*/

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS company_getinfo;

 DELIMITER //
 CREATE PROCEDURE company_getinfo (_company_id int)
 BEGIN

 SELECT * FROM company WHERE company_id = _company_id;

 SELECT a.*, s.company_id FROM address a
 LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id
 ORDER BY a.street, a.zipcode;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL company_getinfo (4);

*/

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};