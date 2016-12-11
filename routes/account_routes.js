/**
 * Created by keegan on 11/16/16.
 */
var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');


// View All accounts
router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('account/accountViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.getById(req.query.account_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('account/accountViewById', {'result': result});
            }
        });
    }
});

// Return the add a new account form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('account/accountAdd', {'account': result});
        }
    });
});

// insert an account record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.first_name == null) {
        res.send('First name must be provided.');
    }
    else if(req.query.last_name == null) {
        res.send('Last name must be provided.');
    }
    else if(req.query.email == null){
        res.send('An email must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        account_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/account/all');
            }
        });
    }
});

// Delete an account for the given account_id
router.get('/delete', function(req, res){
    if(req.query.account_id == null) {
        res.send('address_id is null');
    }
    else {
        account_dal.delete(req.query.account_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/account/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.account_id == null) {
        res.send('A account id is required');
    }
    else {
        account_dal.edit(req.query.account_id, function(err, result){
            console.log(result);
            res.render('account/accountUpdate', {account: result[0][0], accounta: result[1]});
        });
    }

});

router.get('/update', function(req, res) {
    account_dal.update(req.query, function(err, result){
        res.redirect(302, '/account/all');
    });
});




module.exports = router;
