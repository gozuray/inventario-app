import Product from "../models/Product.js";

export const list = async (req, res) => {
  const { q, categoria } = req.query;
  const filter = {};
  if (q) filter.nombre = { $regex: q, $options: "i" };
  if (categoria) filter.categoria = categoria;
  const items = await Product.find(filter).sort({ createdAt: -1 });
  res.json(items);
};

export const create = async (req, res) => {
  const p = await Product.create(req.body);
  res.status(201).json(p);
};

export const update = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(p);
};

export const remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
