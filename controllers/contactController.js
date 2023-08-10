const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@description Get all contacts
//@route GET /api/contacts
//@access public

const fetchContact = asyncHandler (async (req,res) => {

    const contacts = await Contact.find({ user_id: req.user.id});
    res.status(200).json(contacts);
});

const getContact = asyncHandler( async (req,res) => {

    const contact = await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});



//@description Create new contacts
//@route POST /api/contacts
//@access public

const createContact = asyncHandler (async (req,res) => {
    
    console.log("The request body is :", req.body);

    const {name, email, phone} = req.body;
    if(!name || !email || !phone)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json(contact);
});

//@description Update chosen contacts
//@route PUT /api/contacts
//@access public

const updateContact = asyncHandler (async (req,res) => {

    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id)
    {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(

        req.params.id,
        req.body,
        { new: true}
    );



    res.status(200).json(updatedContact);
});

//@description delete chosen contacts
//@route DELETE /api/contacts
//@access public

const deleteContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if( !contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id)
    {
        res.status(403);
        throw new Error("User dont have permission to delete other user contacts");
    }

    await Contact.deleteOne();
    res.status(200).json(contact);
});





module.exports = { fetchContact, getContact, createContact, updateContact, deleteContact};