const Booking = require("../model/Booking.Model");

//create booking

const createBooking = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }

        const { chef, bookingDate, status, notes } = req.body;

        // Create a new booking
        const newBooking = new Booking({
            user: req.user.userId,  // Use authenticated user's ID
            chef,
            bookingDate,
            status,
            notes
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Unauthorized: user not found in token",
      });
    }

    const bookings = await Booking.find({
      user: req.user.userId,
    });

    res.status(200).json({
      message: "Booking fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// we need a single booking
const getBookingById=async(req,res)=>{
     try{
        
        const {id}=req.params;
         const Bookings=await Booking.findById(id);
         if(!Booking){
            return res.status(404).json({message:"Booking not found"});
         }

         res.status(200).json({
            message:"Booking fetched successfully",
            data:Bookings
         })
     }
     catch(error){
        console.error("Error:",error);
         res.status(500).json({message:"Internal server error"});
     }
}

const updateBooking =async(req,res)=>{
    try{
         const {id}=req.params;
         const{chef, bookingDate, status, notes } =req.body;

         const updatedBooking=await Booking.findByIdAndUpdate(id,{
            chef,bookingDate,status,notes
         },
        {new:true});
        if (!updatedBooking) {
  return res.status(404).json({ message: "Booking not found" });
}

        res.status(200).json({
            message:"Booking updated Successfully",
            data:updatedBooking
        })

    }
    catch(error){
        console.error("Error:",error);
        res.status(500).json({
            message: "Internal server error",
          });
    }
}

const deleteBooking = async (req, res) => {
    try {
      const bookings=await Booking.deleteMany();
     
  
      res.status(200).json({
        message: "Booking  deleted successfully",
      data: bookings
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = {createBooking, getBooking, getBookingById, updateBooking, deleteBooking}
