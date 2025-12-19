import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const mongoUri = Deno.env.get('MONGODB_URI');
  
  if (!mongoUri) {
    console.error('MONGODB_URI not configured');
    return new Response(
      JSON.stringify({ error: 'MongoDB connection not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let client: MongoClient | null = null;

  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient();
    await client.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    const db = client.database('veda_office');
    const employees = db.collection('employees');

    const url = new URL(req.url);
    const method = req.method;

    // GET - Fetch all employees
    if (method === 'GET') {
      console.log('Fetching all employees...');
      const allEmployees = await employees.find({}).toArray();
      console.log(`Found ${allEmployees.length} employees`);
      
      // Transform MongoDB _id to id for frontend
      const transformed = allEmployees.map((emp: any) => ({
        id: emp._id.toString(),
        name: emp.name,
        designation: emp.designation,
        department: emp.department,
        phone: emp.phone,
        avatar: emp.avatar,
        status: emp.status || 'online',
      }));

      return new Response(
        JSON.stringify(transformed),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Add new employee
    if (method === 'POST') {
      const body = await req.json();
      console.log('Adding new employee:', body);

      const { name, designation, department, phone, avatar, status } = body;

      if (!name || !designation || !department || !phone) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: name, designation, department, phone' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const newEmployee = {
        name,
        designation,
        department,
        phone,
        avatar: avatar || null,
        status: status || 'online',
        createdAt: new Date(),
      };

      const insertResult = await employees.insertOne(newEmployee);
      console.log('Employee added with ID:', insertResult.toString());

      return new Response(
        JSON.stringify({ 
          id: insertResult.toString(),
          ...newEmployee,
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE - Remove employee
    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Employee ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Deleting employee:', id);
      const deleteResult = await employees.deleteOne({ _id: new ObjectId(id) });
      
      if (deleteResult === 0) {
        return new Response(
          JSON.stringify({ error: 'Employee not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Employee deleted successfully');
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } finally {
    if (client) {
      try {
        client.close();
        console.log('MongoDB connection closed');
      } catch (e) {
        console.error('Error closing MongoDB connection:', e);
      }
    }
  }
});
