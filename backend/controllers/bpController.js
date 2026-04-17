// controllers/bpController.js
// Contains all business logic for BP CRUD operations
// Each function maps to one REST endpoint

const db = require('../config/db');

// ─── Helper: generate unique BP code ───────────────────────────────────────
async function generateBpCode() {
  const [rows] = await db.query('SELECT COUNT(*) AS cnt FROM business_partners');
  const num = String(rows[0].cnt + 1).padStart(3, '0');
  return `ASN${num}`;
}

// ─── GET ALL  →  GET /api/bp ───────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search = '', status = '' } = req.query;

    let sql = 'SELECT * FROM business_partners WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (bp_name LIKE ? OR email LIKE ? OR bp_code LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows, total: rows.length });

  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch records' });
  }
};

// ─── GET ONE  →  GET /api/bp/:id ──────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM business_partners WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, data: rows[0] });

  } catch (err) {
    console.error('getById error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch record' });
  }
};

// ─── CREATE  →  POST /api/bp ──────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const {
      bp_name, email, mobile_no, status = 'Pending',
      customer_group, contact_person, gst_no,
      city, state, country, postal_code, address,
      ship_city, ship_state, ship_country, ship_postal, ship_address
    } = req.body;

    // Validation
    if (!bp_name || !email || !mobile_no) {
      return res.status(400).json({
        success: false,
        message: 'bp_name, email, and mobile_no are required'
      });
    }

    // Email format check
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const bp_code = await generateBpCode();

    const [result] = await db.query(
      `INSERT INTO business_partners
        (bp_code, bp_name, email, mobile_no, status,
         customer_group, contact_person, gst_no,
         city, state, country, postal_code, address,
         ship_city, ship_state, ship_country, ship_postal, ship_address)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        bp_code, bp_name, email, mobile_no, status,
        customer_group || null, contact_person || null, gst_no || null,
        city || null, state || null, country || null, postal_code || null, address || null,
        ship_city || null, ship_state || null, ship_country || null,
        ship_postal || null, ship_address || null
      ]
    );

    const [newRow] = await db.query(
      'SELECT * FROM business_partners WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Business partner created successfully',
      data: newRow[0]
    });

  } catch (err) {
    console.error('create error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create record' });
  }
};

// ─── UPDATE  →  PUT /api/bp/:id ───────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    // Check exists
    const [existing] = await db.query(
      'SELECT id FROM business_partners WHERE id = ?', [id]
    );
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const {
      bp_name, email, mobile_no, status,
      customer_group, contact_person, gst_no,
      city, state, country, postal_code, address,
      ship_city, ship_state, ship_country, ship_postal, ship_address
    } = req.body;

    if (!bp_name || !email || !mobile_no) {
      return res.status(400).json({
        success: false,
        message: 'bp_name, email, and mobile_no are required'
      });
    }

    await db.query(
      `UPDATE business_partners SET
        bp_name=?, email=?, mobile_no=?, status=?,
        customer_group=?, contact_person=?, gst_no=?,
        city=?, state=?, country=?, postal_code=?, address=?,
        ship_city=?, ship_state=?, ship_country=?, ship_postal=?, ship_address=?
       WHERE id=?`,
      [
        bp_name, email, mobile_no, status,
        customer_group || null, contact_person || null, gst_no || null,
        city || null, state || null, country || null,
        postal_code || null, address || null,
        ship_city || null, ship_state || null, ship_country || null,
        ship_postal || null, ship_address || null,
        id
      ]
    );

    const [updated] = await db.query(
      'SELECT * FROM business_partners WHERE id = ?', [id]
    );

    res.json({
      success: true,
      message: 'Business partner updated successfully',
      data: updated[0]
    });

  } catch (err) {
    console.error('update error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    res.status(500).json({ success: false, message: 'Failed to update record' });
  }
};

// ─── DELETE  →  DELETE /api/bp/:id ────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM business_partners WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Business partner deleted successfully' });

  } catch (err) {
    console.error('remove error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete record' });
  }
};
