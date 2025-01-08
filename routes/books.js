import express from "express"
import { dbQuery, dbRun } from "../database.js"

const router = express.Router()

router.get("/", async (req,res,next)=>{
    try {
        const books = await dbQuery("SELECT * FROM books")
        res.status(200).json(books)
        
    } catch (err) {
        next(err)
    }
})
router.get("/:id", async (req,res,next) => {
    try {
        const [book] = await dbQuery("SELECT * FROM books WHERE id = ?;", [req.params.id])
        if (![book]) {
            return res.status(404).json({message: "Not found!"})
        }
        else{
            res.status(200).json(book)
        }
        
    } catch (err) {
        next(err)
    }
})
router.post("/", async (req,res, next) =>{
    try {
        const book = await dbRun("INSERT INTO books (title, author, description, year) VALUES (?,?,?,?)", [req.params.title, req.params.author, req.params.description, req.params.year])
        res.status(201).json({ id: result.lastID, ...req.body });
        
    } catch (err) {
        next(err)
    }
})
router.put("/:id", async (req,res,next) =>{
    try {
        const [book] = await dbQuery("SELECT * FROM books WHERE id = ?;", [req.params.id])
        if (![book]) {
            return res.status(404).json({message: "Not found!"})
        }
        else{
            await dbRun("UPDATE TABLE books SET title = ?, author = ?, description = ?, year = ? WHERE id = ?", [req.params.id, req.body.title, req.body.author, req.body.description, req.body.year])
            res.status(200).json({id: req.params.id, title: req.body.title || book.title, author: req.body.author || book.author, description: req.body.description || book.description, year: req.body.year || book.year})
        }
    } catch (err) {
        next(err)
    }
})
router.delete("/:id", async (req,res,next) =>{
    const [book] = await dbQuery("SELECT * FROM books WHERE id = ?;", [req.params.id])
    if (![book]) {
        return res.status(404).json({message: "Not found!"})
    }
    else{
        await dbRun("DELETE FROM books WHERE id = ?;", [req.params.id])
        res.sendStatus(204)
    }
})

export default router;