const Certificate=require('../models/certificate')

exports.getCertificates=async(req,res)=>{

     try {
            const data = await Certificate.find();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
}

exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Certificate.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: "Certificate not found" })
    }
    res.status(200).json({ message: "Certificate deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

exports.addCertificate = async (req, res) => {
  try {
    const { customerName, email, category, certificateNumber, issueDate, expiryDate } = req.body

    const newCertificate = new Certificate({
      customerName,
      email,
      category,
      certificateNumber,
      issueDate,
      expiryDate
    })

    await newCertificate.save()
    res.status(201).json({ message: "Certificate added successfully", certificate: newCertificate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
